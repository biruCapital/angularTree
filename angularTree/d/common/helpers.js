(function (exports) {
    // a helper function for timestamp/date formatting
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    // a helper function for timestamp formatting
    // Returns the string representation of a date (YYYY-MM-DD HH:MM:SS)
    function normalizeTS(ts) {
        if (!ts) {
            return "null";
        }
        if (typeof ts === "string") { // the timestamp wasn't changed
            return ts;
        } else {
            return ts.getFullYear() +
                '-' + pad(ts.getMonth() + 1) + // January is 0, December is 11
                '-' + pad(ts.getDate()) +
                ' ' + pad(ts.getHours()) +
                ':' + pad(ts.getMinutes()) +
                ':' + pad(ts.getUTCSeconds());
        }
    }

    // Trims milliseconds from a datetime string,
    // converts null to an empty string
    exports["trimMs"] = function (ts) {
        return typeof ts === "string" ? ts.replace(/\..*/, '') : "";
    };

    // Converts a  't'/'f' string into a boolean
    // Should be used only as a parse function in models
    exports["parseBool"] = function (v) {
        return (v === 't' || v === true) ? true : false;
    };

    // Converts a 't'/'f'/'null' string into a boolean
    exports["normalizeBooleans"] = function (dataObj, fieldNames) {
        fieldNames.forEach(function (field) {
            dataObj[field] = dataObj[field] === 't' ? true : false;
        });
    };

    // Processes the values of numeric input fields
    // to make them ready for the DB
    exports["normalizeNumbers"] = function (dataObj, fieldNames) {
        fieldNames.forEach(function (field) {
            dataObj[field] = dataObj[field] === null ? "null" : dataObj[field];
        });
    };

    // Processes the values of timestamp (w/o TZ) input fields
    // to make them ready for the DB
    exports["normalizeTimestamps"] = function (dataObj, fieldNames) {
        fieldNames.forEach(function (field) {
            dataObj[field] = normalizeTS(dataObj[field]);
        });
    };

    // Mustache.js, license: MIT
    // https://github.com/janl/mustache.js/blob/master/mustache.js
     var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    exports["escapeHTML"] = function (string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
        });
    };

    // Returns a field template for the given boolean column
    exports["makeBooleanTemplate"] = function (field_name) {
        return '# if(!' + field_name + ') { ## } else { #<strong>✓</strong># }#';
    };

})(this.dps = {});
