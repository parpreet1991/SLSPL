/* added a function to call after AJAX
*  added support for multiple tables
*/
function initResponsiveTables() {
 tables = document.querySelectorAll(".table-responsive")
	
  
  for (t = 0; t < tables.length; ++t) {
   
    var headertext = [],     
		headers = tables[t].querySelectorAll(".table-responsive table th, table.table-responsive th"),
		tablebody = tables[t].querySelector(".table-responsive table tbody, table.table-responsive tbody");
    
    for (var i = 0; i < headers.length; i++) {
		var current = headers[i];
		headertext.push(current.textContent.replace(/\r?\n|\r/, ""));
    }
    for (var i = 0, row; row = tablebody.rows[i]; i++) {
      for (var j = 0, col; col = row.cells[j]; j++) {
        col.setAttribute("data-th", headertext[j]);
      }
    }
  }
}
initResponsiveTables();