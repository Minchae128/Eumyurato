"use strict";
var KTFormsCKEditorBalloon = {
    init: function () {
        BalloonEditor.create(document.querySelector("#kt_docs_ckeditor_balloon")).then((o => {
            console.log(o)
        })).catch((o => {
            console.error(o)
        }))
    }
};
KTUtil.onDOMContentLoaded((function () {
    KTFormsCKEditorBalloon.init()
}));