const humTime = min => {
    if (min >= 60) {
        const now = moment();
        return countdown(now.clone().subtract(min, "minutes").toDate(), now.toDate(), countdown.MINUTES | countdown.HOURS).toString();
    }
    
    return `${min} м.`;
}

function Info(props){
    return (
        <div>
            <h5>Возраст: <span>{props.row.interval[0]} - {props.row.interval[1]-1} месяца</span></h5>
            <h5>ВБ между снами: <span>{humTime(props.row.awake[0])} - {humTime(props.row.awake[1])}</span></h5>
        </div>
    )
}

ReactDOM.render(<Info row={globalInfo} />, document.getElementById("info"));

/*var x = {
    interval: [0, 1],
    awake: [20, 50],
    count: [4, 8],
    duration: [15, 240],
    totalDuration: [360, 600],
    totalNight: [480, 600],
    totalAll: [960, 1200]
}*/