const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;
const useMemo = React.useMemo;

const useStateWithLocalStorage = localStorageKey => {
    const [value, setValue] = useState(
      JSON.parse(localStorage.getItem(localStorageKey)) || []
    );
  
    useEffect(() => {
      localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);
  
    return [value, setValue];
};

const humTime = min => {
    if (min >= 60) {
        const now = moment();
        return countdown(now.clone().subtract(min, "minutes").toDate(), now.toDate(), countdown.MINUTES | countdown.HOURS).toString();
    }
    
    return `${min} м.`;
};

const Info = ({row}) => (
    <div>
        <h5>Возраст: <span>{row.interval[0]} - {row.interval[1]-1} месяца</span></h5>
        <h5>ВБ между снами: <span>{humTime(row.awake[0])} - {humTime(row.awake[1])}</span></h5>
    </div>
);

const SpaceFiller = () => (
    <div style={{margin: '1em 0 1em 0'}}></div>
);

const DateTimePicker = ({dateTime, setDateTime}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        $(inputRef.current).datetimepicker({
            uiLibrary: 'bootstrap4',
            modal: true,
            format: 'dd-mm-yyyy HH:MM',
            locale: 'ru-ru',
            value: dateTime,
            mode: '24hr',
            
            change: function (e) {
                setDateTime(e.target.value);
            }
        });
    }, []);

    return (
        <input ref={inputRef} />
    );
};

const AddNewSleep = ({addSleepHandler, date1, date2, night, id}) => {
    const [dateTime1, setDateTime1] = useState(date1 || moment().format("DD-MM-YYYY HH:mm"));
    const [dateTime2, setDateTime2] = useState(date2 || moment().format("DD-MM-YYYY HH:mm"));
    const [isNight, setIsNight] = useState(night === undefined ? true : night);

    const handleAdd = e => {
        addSleepHandler({dateTime1, dateTime2, isNight, id: Date.now()});
    };

    const handleSleepType = e => {
        setIsNight(!isNight);
    };

    return (
        <div id={id}>
            <DateTimePicker dateTime={dateTime1} setDateTime={setDateTime1} />
            <SpaceFiller/>
            <DateTimePicker dateTime={dateTime2} setDateTime={setDateTime2} />
            <SpaceFiller/>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" checked={isNight} onChange={handleSleepType}/>
                <label className="form-check-label" htmlFor="inlineRadio1">Ночной</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" checked={!isNight} onChange={handleSleepType}/>
                <label className="form-check-label" htmlFor="inlineRadio2">Дневной</label>
            </div>
            <SpaceFiller/>
            <button type="button" className="btn btn-secondary btn-block" onClick={handleAdd}>Записать</button>
        </div>
    );
};

const timeOfSleep = i => {
    const timeOfRecord = moment(i.dateTime1, "DD-MM-YYYY HH:mm");
    const timeOfRecord2 = moment(i.dateTime2, "DD-MM-YYYY HH:mm");
    return moment.duration(timeOfRecord2.diff(timeOfRecord)).asMinutes();
};

const isNightDataForProgress = (i, now) => {
    const yesterdayNoon = now.clone().add(-1, 'day').set('hour', 13);
    const todayNoon = now.clone().set('hour', 13);
    const timeOfRecord = moment(i.dateTime1, "DD-MM-YYYY HH:mm");
    return i.isNight && timeOfRecord.isBetween(yesterdayNoon, todayNoon);
};

const isDayDataForProgress = (i, now) => {
    return !i.isNight && moment(i.dateTime1, "DD-MM-YYYY HH:mm").isSame(now, 'day');
};

const ProgressBars = ({data, row, now}) => {
    const processNight = d => {
        const totalNightSleep = d
            .filter(i => isNightDataForProgress(i, now))
            .reduce((sum, i) => sum + timeOfSleep(i), 0);

        const possibleSleep = row.totalNight[0];
        const left = possibleSleep - totalNightSleep;

        if (left <= 0) {
            return {percent: 100, totalNightSleep};
        }

        const percent = left * 100 / possibleSleep;

        return {percent: 100 - Math.floor(percent), totalNightSleep};
    };

    const processDay = d => {
        const totalDaySleep = d
            .filter(i => isDayDataForProgress(i, now))
            .reduce((sum, i) => sum + timeOfSleep(i), 0);

        const possibleSleep = row.totalDuration[0];
        const left = possibleSleep - totalDaySleep;

        if (left <= 0) {
            return {percent: 100, totalDaySleep};
        }

        const percent = left * 100 / possibleSleep;

        return {percent: 100 - Math.floor(percent), totalDaySleep};
    };

    const nightProgressData = useMemo(() => processNight(data), [data, now]);
    const dayProgressData = useMemo(() => processDay(data), [data, now]);

    return (
        <React.Fragment>
            <p>Ночной сон({humTime(row.totalNight[0])} - {humTime(row.totalNight[1])}):</p>
            <div className="progress">
                <div className="progress-bar" style={{width: nightProgressData.percent + '%'}} role="progressbar">{humTime(nightProgressData.totalNightSleep)}</div>
            </div>
            <SpaceFiller/>
            <p>Дневной сон({humTime(row.totalDuration[0])} - {humTime(row.totalDuration[1])}):</p>
            <div className="progress">
                <div className="progress-bar" style={{width: dayProgressData.percent + '%'}} role="progressbar">{humTime(dayProgressData.totalDaySleep)}</div>
            </div>
        </React.Fragment>
    );
};

const RecordGrid = ({now, data, setData, handleEdit}) => {
    const row = ({id, startDate, duration, isNight, editHandler, removeHandler}) => {
        let style = {marginTop: "2px"};
        if (isNight){
            style = {...style, backgroundColor: "blanchedalmond"};
        }

        return (
            <div className="row" key={id} style={style}>
                <div className="col-3 text-center align-self-center">
                    {startDate}
                </div>
                <div className="col-4 text-center align-self-center">
                    {duration}
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-warning btn-sm" onClick={editHandler}>Ред.</button>
                </div>
                <div className="col-2">
                    <button type="button" className="btn btn-danger btn-sm" onClick={removeHandler}>Удл.</button>
                </div>
            </div>
        );
    };

    const grid = data.filter(i => isDayDataForProgress(i, now) || isNightDataForProgress(i, now))
        .sort((a,b) => moment(a.dateTime1, "DD-MM-YYYY HH:mm").toDate().getTime() - moment(b.dateTime1, "DD-MM-YYYY HH:mm").toDate().getTime())
        .map(i => row({
            id: i.id,
            startDate: moment(i.dateTime1, "DD-MM-YYYY HH:mm").format("HH:mm"),
            duration: humTime(timeOfSleep(i)),
            isNight: i.isNight,
            editHandler: e => {e.preventDefault(); handleEdit(i.id);},
            removeHandler: e => {e.preventDefault(); setData(data.filter(e => e.id != i.id));}
        }));

    if (grid.length > 0) {
        return <div>{grid}</div>;
    }
    else {
        return <h5 className="text-center">Нет записей</h5>
    }
};

const Edit = ({enabled, id, data, setData, setEdit}) => {
    if (!enabled) {
        return null;
    }

    const el = data.filter(i => i.id == id)[0];
    const addSleepHandler = n => {
        let newData = data.filter(i => i.id != id);
        newData = [...newData, n];
        setEdit(false);
        setData(newData);
    };

    return (
        <AddNewSleep {...{addSleepHandler, date1: el.dateTime1, date2: el.dateTime2, night: el.isNight, id: `${id}`}} />
    );
};

const App = () => {
    const [data, setData] = useStateWithLocalStorage('babySleepData');
    const [now, setNow] = useState(moment());
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState(0);

    const addSleepHandler = sleepItem => {
        setData([...data, sleepItem]);
    };

    const bck = e => {
        e.preventDefault();
        setEdit(false);
        setNow(now.clone().add(-1, 'day'));
    };

    const tdy = e => {
        e.preventDefault();
        setEdit(false);
        setNow(moment());
    };

    const fwd = e => {
        e.preventDefault();
        setEdit(false);
        setNow(now.clone().add(1, 'day'));
    };

    const editHandler = id => {
        setId(id);
        setEdit(!edit);
    };

    return (
        <React.Fragment>
            <Info row={globalInfo} />
            <SpaceFiller/>
            <button type="button" className="btn btn-primary btn-block" data-target="#recordSleep" data-toggle="collapse">Записать сон</button>
            <SpaceFiller/>
            <div id="recordSleep" className="collapse">
                <AddNewSleep {...{addSleepHandler, id:"add"}} />
            </div>
            <SpaceFiller/>
            <ProgressBars data={data} row={globalInfo} now={now} />
            <SpaceFiller/>
            <div className="btn-group btn-block" role="group">
                <button type="button" className="btn btn-secondary" onClick={bck}>{now.clone().add(-1, 'day').format('DD.MM')}</button>
                <button type="button" className="btn btn-secondary" onClick={tdy}>Сегодня</button>
                <button type="button" className="btn btn-secondary" onClick={fwd}>{now.clone().add(1, 'day').format('DD.MM')}</button>
            </div>
            <SpaceFiller/>
            <RecordGrid now={now} data={data} setData={setData} handleEdit={editHandler} />
            <SpaceFiller/>
            <Edit enabled={edit} setEdit={setEdit} id={id} data={data} setData={setData} />
        </React.Fragment>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));