//This is a helper class that mostly just makes the telerik grid more keyboard friendly.
var kendoGridHelper = {};
 
kendoGridHelper.init = function (o) {
    /// <summary>
    ///Binds onSelect, keyboard navi, and databound row resselect
    ///Returns nothing.
    /// </summary>
    /// <param name="o" type="Dictionary">
    /// grid: html grid, onSelect, onDblClick
    /// </param>
 
    var grid = o.grid;
    var onSelect = o.onSelect;
    var onDblClick = o.onDblClick;
 
    var kGrid = grid.data('kendoGrid');
 
    //give rows tabindex, reselect row
    kGrid.bind('dataBound', function (e) {
        kendoGridHelper.onDataBound({ grid: grid, onSelect: onSelect });
    });
 
    //bind arrows to navigate
    kendoGridHelper.bindNavigatable({ grid: grid });
 
    //bind change event
    kendoGridHelper.bindChange({ grid: grid, onSelect: onSelect });
 
    //bind dblclick
    if (onDblClick != undefined) {
        $('.k-grid-content tr', grid)
            .live('dblclick', function (e) { //bind row dblclick
                var id = grid.data('kendoGrid').dataItem(e.currentTarget).id;
                onDblClick(id);
            });
    }
 
};
 
kendoGridHelper.bindNavigatable = function (o) {
 
    var grid = o.grid;
     
    var target = $('.k-grid-content', grid);
    //give it a tabindex so it can get focus and accept key input.
    target.attr("tabindex", 0);
     
    //Detecting when the scrollbar is clicked to prevent the focus event from firing and scrolling back up/down.
    target.mousedown(function (e) {
        var innerWidth = target.find('table').first().width();
        if (e.offsetX > innerWidth)
            e.preventDefault();
    });
 
    //This allows a diff background color for a selected row based on whether the grid has focus or not.
    target.focus(function (e) {
        var selRow = grid.find('.k-state-selected');
        if (selRow.length) {
            selRow.focus();
        }
    });
 
 
    target.keydown(function (ke) {
 
        //override scroll bar so arrows will navigate rows without scrolling.
        ke.preventDefault();
 
        var kGrid, curRow, newRow;
 
        kGrid = $(this).closest('.k-grid').data("kendoGrid");
 
        //get currently selected row
        curRow = kGrid.select();
 
        //abort if no row selected
        if (!curRow.length)
            return;
 
        //get newRow up or down.
        if (ke.which == 38) {
            newRow = curRow.prev();
        } else if (ke.which == 40) {
            newRow = curRow.next();
        } else {
            return;
        }
 
        //Top or Bottom exceeded, abort.
        if (!newRow.length)
            return;
 
        //Select new row
        kGrid.select(newRow);
        //
        newRow.focus();
    });
 
};
 
kendoGridHelper.bindChange = function (o) {
    var grid = o.grid;
    var onSelect = o.onSelect;
 
    var kGrid = grid.data('kendoGrid');
 
    kGrid.bind('change', function (e) {
 
        //This fixes the problem of losing focus on auto-refresh
        if (document.activeElement == document.body)
            kGrid.select().focus();
 
        //When using Kendo grid mvc wrapper, the datasource is not set, so accessing dataItem will fail.
        if (!kGrid.dataSource.data().length)
            return;
 
        //Set grid.selectedId, and execute onSelect
        var selectedId = kGrid.dataItem(kGrid.select()).id;
 
        if (selectedId != kGrid.selectedId && onSelect != undefined) {
            kGrid.selectedId = selectedId;
            onSelect(selectedId);
        } else {
            kGrid.selectedId = selectedId;
        }
    });
};
 
//Mostly this function just takes care of reselecting the global kGrid.selectedId. 
//Before I tried to not use a global, and call refresh with an id, but the problem is that
//other things call a data fetch like sorting, paging, manual refresh, and I have no way of sending the id with them.
//So a global flag, autoRefresh is used to denote when to call the onSelect method or not.  Calling onSelect while
//in autoRefresh mode would be bad since it would interrupt other UI stuff going on.
kendoGridHelper.onDataBound = function (o) {
    /// <summary>
    ///Binds databound row resselect
    ///Returns nothing.
    /// </summary>
    /// <param name="o" type="Dictionary">
    /// grid: html grid, onSelect
    /// </param>
    var grid = o.grid;
    var onSelect = o.onSelect;
 
    var kGrid = grid.data('kendoGrid');
 
    //give rows a tabindex so focus will work
    kGrid.content.find('tr').attr('tabindex', 0);
 
    //Reselect saved row by grid.selectedId
    if (kGrid.selectedId != undefined) {
        var dataRow = kGrid.dataSource.get(kGrid.selectedId);
        if (dataRow != undefined) {
            var row = kGrid.table.find("tr[data-uid='" + dataRow.uid + "']");
            if (row.length) {
                kGrid.select(row);
                //call onSelect method since change event will ignore it since the selectedId has not changed.
                if (!kGrid.autoRefresh && onSelect != undefined)
                    onSelect(kGrid.selectedId);
            }
        }
    }
 
    //select first row if nothing else selected
    if (!kGrid.select().length && kGrid.table.find('tr').length) {
        kGrid.select(kGrid.table.find('tr').first());
    }
 
    kGrid.autoRefresh = false;
 
};