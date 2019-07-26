var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;
var useMemo = React.useMemo;

var useStateWithLocalStorage = function useStateWithLocalStorage(localStorageKey) {
    var _useState = useState(JSON.parse(localStorage.getItem(localStorageKey)) || []),
        _useState2 = _slicedToArray(_useState, 2),
        value = _useState2[0],
        setValue = _useState2[1];

    useEffect(function () {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};

var humTime = function humTime(min) {
    if (min >= 60) {
        var now = moment();
        return countdown(now.clone().subtract(min, "minutes").toDate(), now.toDate(), countdown.MINUTES | countdown.HOURS).toString();
    }

    return min + ' \u043C.';
};

var Info = function Info(_ref) {
    var row = _ref.row;
    return React.createElement(
        'div',
        null,
        React.createElement(
            'h5',
            null,
            '\u0412\u043E\u0437\u0440\u0430\u0441\u0442: ',
            React.createElement(
                'span',
                null,
                row.interval[0],
                ' - ',
                row.interval[1] - 1,
                ' \u043C\u0435\u0441\u044F\u0446\u0430'
            )
        ),
        React.createElement(
            'h5',
            null,
            '\u0412\u0411 \u043C\u0435\u0436\u0434\u0443 \u0441\u043D\u0430\u043C\u0438: ',
            React.createElement(
                'span',
                null,
                humTime(row.awake[0]),
                ' - ',
                humTime(row.awake[1])
            )
        )
    );
};

var SpaceFiller = function SpaceFiller() {
    return React.createElement('div', { style: { margin: '1em 0 1em 0' } });
};

var DateTimePicker = function DateTimePicker(_ref2) {
    var dateTime = _ref2.dateTime,
        setDateTime = _ref2.setDateTime;

    var inputRef = useRef(null);

    useEffect(function () {
        $(inputRef.current).datetimepicker({
            uiLibrary: 'bootstrap4',
            modal: true,
            format: 'dd-mm-yyyy HH:MM',
            locale: 'ru-ru',
            value: dateTime,
            mode: '24hr',

            change: function change(e) {
                setDateTime(e.target.value);
            }
        });
    }, []);

    return React.createElement('input', { ref: inputRef });
};

var AddNewSleep = function AddNewSleep(_ref3) {
    var addSleepHandler = _ref3.addSleepHandler,
        date1 = _ref3.date1,
        date2 = _ref3.date2,
        night = _ref3.night,
        id = _ref3.id;

    var _useState3 = useState(date1 || moment().format("DD-MM-YYYY HH:mm")),
        _useState4 = _slicedToArray(_useState3, 2),
        dateTime1 = _useState4[0],
        setDateTime1 = _useState4[1];

    var _useState5 = useState(date2 || moment().format("DD-MM-YYYY HH:mm")),
        _useState6 = _slicedToArray(_useState5, 2),
        dateTime2 = _useState6[0],
        setDateTime2 = _useState6[1];

    var _useState7 = useState(night === undefined ? true : night),
        _useState8 = _slicedToArray(_useState7, 2),
        isNight = _useState8[0],
        setIsNight = _useState8[1];

    var handleAdd = function handleAdd(e) {
        addSleepHandler({ dateTime1: dateTime1, dateTime2: dateTime2, isNight: isNight, id: Date.now() });
    };

    var handleSleepType = function handleSleepType(e) {
        setIsNight(!isNight);
    };

    return React.createElement(
        'div',
        { id: id },
        React.createElement(DateTimePicker, { dateTime: dateTime1, setDateTime: setDateTime1 }),
        React.createElement(SpaceFiller, null),
        React.createElement(DateTimePicker, { dateTime: dateTime2, setDateTime: setDateTime2 }),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'div',
            { className: 'form-check form-check-inline' },
            React.createElement('input', { className: 'form-check-input', type: 'radio', name: 'inlineRadioOptions', id: 'inlineRadio1', value: 'option1', checked: isNight, onChange: handleSleepType }),
            React.createElement(
                'label',
                { className: 'form-check-label', htmlFor: 'inlineRadio1' },
                '\u041D\u043E\u0447\u043D\u043E\u0439'
            )
        ),
        React.createElement(
            'div',
            { className: 'form-check form-check-inline' },
            React.createElement('input', { className: 'form-check-input', type: 'radio', name: 'inlineRadioOptions', id: 'inlineRadio2', value: 'option2', checked: !isNight, onChange: handleSleepType }),
            React.createElement(
                'label',
                { className: 'form-check-label', htmlFor: 'inlineRadio2' },
                '\u0414\u043D\u0435\u0432\u043D\u043E\u0439'
            )
        ),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'button',
            { type: 'button', className: 'btn btn-secondary btn-block', onClick: handleAdd },
            '\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C'
        )
    );
};

var timeOfSleep = function timeOfSleep(i) {
    var timeOfRecord = moment(i.dateTime1, "DD-MM-YYYY HH:mm");
    var timeOfRecord2 = moment(i.dateTime2, "DD-MM-YYYY HH:mm");
    return moment.duration(timeOfRecord2.diff(timeOfRecord)).asMinutes();
};

var isNightDataForProgress = function isNightDataForProgress(i, now) {
    var yesterdayNoon = now.clone().add(-1, 'day').set('hour', 13);
    var todayNoon = now.clone().set('hour', 13);
    var timeOfRecord = moment(i.dateTime1, "DD-MM-YYYY HH:mm");
    return i.isNight && timeOfRecord.isBetween(yesterdayNoon, todayNoon);
};

var isDayDataForProgress = function isDayDataForProgress(i, now) {
    return !i.isNight && moment(i.dateTime1, "DD-MM-YYYY HH:mm").isSame(now, 'day');
};

var ProgressBars = function ProgressBars(_ref4) {
    var data = _ref4.data,
        row = _ref4.row,
        now = _ref4.now;

    var processNight = function processNight(d) {
        var totalNightSleep = d.filter(function (i) {
            return isNightDataForProgress(i, now);
        }).reduce(function (sum, i) {
            return sum + timeOfSleep(i);
        }, 0);

        var possibleSleep = row.totalNight[0];
        var left = possibleSleep - totalNightSleep;

        if (left <= 0) {
            return { percent: 100, totalNightSleep: totalNightSleep };
        }

        var percent = left * 100 / possibleSleep;

        return { percent: 100 - Math.floor(percent), totalNightSleep: totalNightSleep };
    };

    var processDay = function processDay(d) {
        var totalDaySleep = d.filter(function (i) {
            return isDayDataForProgress(i, now);
        }).reduce(function (sum, i) {
            return sum + timeOfSleep(i);
        }, 0);

        var possibleSleep = row.totalDuration[0];
        var left = possibleSleep - totalDaySleep;

        if (left <= 0) {
            return { percent: 100, totalDaySleep: totalDaySleep };
        }

        var percent = left * 100 / possibleSleep;

        return { percent: 100 - Math.floor(percent), totalDaySleep: totalDaySleep };
    };

    var nightProgressData = useMemo(function () {
        return processNight(data);
    }, [data, now]);
    var dayProgressData = useMemo(function () {
        return processDay(data);
    }, [data, now]);

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'p',
            null,
            '\u041D\u043E\u0447\u043D\u043E\u0439 \u0441\u043E\u043D(',
            humTime(row.totalNight[0]),
            ' - ',
            humTime(row.totalNight[1]),
            '):'
        ),
        React.createElement(
            'div',
            { className: 'progress' },
            React.createElement(
                'div',
                { className: 'progress-bar', style: { width: nightProgressData.percent + '%' }, role: 'progressbar' },
                humTime(nightProgressData.totalNightSleep)
            )
        ),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'p',
            null,
            '\u0414\u043D\u0435\u0432\u043D\u043E\u0439 \u0441\u043E\u043D(',
            humTime(row.totalDuration[0]),
            ' - ',
            humTime(row.totalDuration[1]),
            '):'
        ),
        React.createElement(
            'div',
            { className: 'progress' },
            React.createElement(
                'div',
                { className: 'progress-bar', style: { width: dayProgressData.percent + '%' }, role: 'progressbar' },
                humTime(dayProgressData.totalDaySleep)
            )
        )
    );
};

var RecordGrid = function RecordGrid(_ref5) {
    var now = _ref5.now,
        data = _ref5.data,
        setData = _ref5.setData,
        handleEdit = _ref5.handleEdit;

    var row = function row(_ref6) {
        var id = _ref6.id,
            startDate = _ref6.startDate,
            duration = _ref6.duration,
            isNight = _ref6.isNight,
            editHandler = _ref6.editHandler,
            removeHandler = _ref6.removeHandler;

        var style = { marginTop: "2px" };
        if (isNight) {
            style = Object.assign({}, style, { backgroundColor: "blanchedalmond" });
        }

        return React.createElement(
            'div',
            { className: 'row', key: id, style: style },
            React.createElement(
                'div',
                { className: 'col-3 text-center align-self-center' },
                startDate
            ),
            React.createElement(
                'div',
                { className: 'col-4 text-center align-self-center' },
                duration
            ),
            React.createElement(
                'div',
                { className: 'col-2' },
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-warning btn-sm', onClick: editHandler },
                    '\u0420\u0435\u0434.'
                )
            ),
            React.createElement(
                'div',
                { className: 'col-2' },
                React.createElement(
                    'button',
                    { type: 'button', className: 'btn btn-danger btn-sm', onClick: removeHandler },
                    '\u0423\u0434\u043B.'
                )
            )
        );
    };

    var grid = data.filter(function (i) {
        return isDayDataForProgress(i, now) || isNightDataForProgress(i, now);
    }).sort(function (a, b) {
        return moment(a.dateTime1, "DD-MM-YYYY HH:mm").toDate().getTime() - moment(b.dateTime1, "DD-MM-YYYY HH:mm").toDate().getTime();
    }).map(function (i) {
        return row({
            id: i.id,
            startDate: moment(i.dateTime1, "DD-MM-YYYY HH:mm").format("HH:mm"),
            duration: humTime(timeOfSleep(i)),
            isNight: i.isNight,
            editHandler: function editHandler(e) {
                e.preventDefault();handleEdit(i.id);
            },
            removeHandler: function removeHandler(e) {
                e.preventDefault();setData(data.filter(function (e) {
                    return e.id != i.id;
                }));
            }
        });
    });

    if (grid.length > 0) {
        return React.createElement(
            'div',
            null,
            grid
        );
    } else {
        return React.createElement(
            'h5',
            { className: 'text-center' },
            '\u041D\u0435\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439'
        );
    }
};

var Edit = function Edit(_ref7) {
    var enabled = _ref7.enabled,
        id = _ref7.id,
        data = _ref7.data,
        setData = _ref7.setData,
        setEdit = _ref7.setEdit;

    if (!enabled) {
        return null;
    }

    var el = data.filter(function (i) {
        return i.id == id;
    })[0];
    var addSleepHandler = function addSleepHandler(n) {
        var newData = data.filter(function (i) {
            return i.id != id;
        });
        newData = [].concat(_toConsumableArray(newData), [n]);
        setEdit(false);
        setData(newData);
    };

    return React.createElement(AddNewSleep, { addSleepHandler: addSleepHandler, date1: el.dateTime1, date2: el.dateTime2, night: el.isNight, id: '' + id });
};

var App = function App() {
    var _useStateWithLocalSto = useStateWithLocalStorage('babySleepData'),
        _useStateWithLocalSto2 = _slicedToArray(_useStateWithLocalSto, 2),
        data = _useStateWithLocalSto2[0],
        setData = _useStateWithLocalSto2[1];

    var _useState9 = useState(moment()),
        _useState10 = _slicedToArray(_useState9, 2),
        now = _useState10[0],
        setNow = _useState10[1];

    var _useState11 = useState(false),
        _useState12 = _slicedToArray(_useState11, 2),
        edit = _useState12[0],
        setEdit = _useState12[1];

    var _useState13 = useState(0),
        _useState14 = _slicedToArray(_useState13, 2),
        id = _useState14[0],
        setId = _useState14[1];

    var addSleepHandler = function addSleepHandler(sleepItem) {
        setData([].concat(_toConsumableArray(data), [sleepItem]));
    };

    var bck = function bck(e) {
        e.preventDefault();
        setEdit(false);
        setNow(now.clone().add(-1, 'day'));
    };

    var tdy = function tdy(e) {
        e.preventDefault();
        setEdit(false);
        setNow(moment());
    };

    var fwd = function fwd(e) {
        e.preventDefault();
        setEdit(false);
        setNow(now.clone().add(1, 'day'));
    };

    var editHandler = function editHandler(id) {
        setId(id);
        setEdit(!edit);
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Info, { row: globalInfo }),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'button',
            { type: 'button', className: 'btn btn-primary btn-block', 'data-target': '#recordSleep', 'data-toggle': 'collapse' },
            '\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0441\u043E\u043D'
        ),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'div',
            { id: 'recordSleep', className: 'collapse' },
            React.createElement(AddNewSleep, { addSleepHandler: addSleepHandler, id: "add" })
        ),
        React.createElement(SpaceFiller, null),
        React.createElement(ProgressBars, { data: data, row: globalInfo, now: now }),
        React.createElement(SpaceFiller, null),
        React.createElement(
            'div',
            { className: 'btn-group btn-block', role: 'group' },
            React.createElement(
                'button',
                { type: 'button', className: 'btn btn-secondary', onClick: bck },
                now.clone().add(-1, 'day').format('DD.MM')
            ),
            React.createElement(
                'button',
                { type: 'button', className: 'btn btn-secondary', onClick: tdy },
                '\u0421\u0435\u0433\u043E\u0434\u043D\u044F'
            ),
            React.createElement(
                'button',
                { type: 'button', className: 'btn btn-secondary', onClick: fwd },
                now.clone().add(1, 'day').format('DD.MM')
            )
        ),
        React.createElement(SpaceFiller, null),
        React.createElement(RecordGrid, { now: now, data: data, setData: setData, handleEdit: editHandler }),
        React.createElement(SpaceFiller, null),
        React.createElement(Edit, { enabled: edit, setEdit: setEdit, id: id, data: data, setData: setData })
    );
};

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));