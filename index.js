var humTime = function humTime(min) {
    if (min >= 60) {
        var now = moment();
        return countdown(now.clone().subtract(min, "minutes").toDate(), now.toDate(), countdown.MINUTES | countdown.HOURS).toString();
    }

    return min + " \u043C.";
};

function Info(props) {
    return React.createElement(
        "div",
        null,
        React.createElement(
            "h5",
            null,
            "\u0412\u043E\u0437\u0440\u0430\u0441\u0442: ",
            React.createElement(
                "span",
                null,
                props.row.interval[0],
                " - ",
                props.row.interval[1] - 1,
                " \u043C\u0435\u0441\u044F\u0446\u0430"
            )
        ),
        React.createElement(
            "h5",
            null,
            "\u0412\u0411 \u043C\u0435\u0436\u0434\u0443 \u0441\u043D\u0430\u043C\u0438: ",
            React.createElement(
                "span",
                null,
                humTime(props.row.awake[0]),
                " - ",
                humTime(props.row.awake[1])
            )
        )
    );
}

ReactDOM.render(React.createElement(Info, { row: globalInfo }), document.getElementById("info"));

/*var x = {
    interval: [0, 1],
    awake: [20, 50],
    count: [4, 8],
    duration: [15, 240],
    totalDuration: [360, 600],
    totalNight: [480, 600],
    totalAll: [960, 1200]
}*/