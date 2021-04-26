function initDragDrop() {
    $(".ui-widget-content").draggable( {
    cursor: 'move',
    containment: 'document',
    helper: myHelper
  } ); 

    $(".ui-widget-content").droppable({
        drop: function(event, ui) {
            var draggable = ui.draggable;

            var fromLang = this.attributes['fromlang'].value; 
            var toLang = draggable.attr('tolang');
            var toDone = draggable.attr('done');

            if (!toDone)
            {
                if (fromLang == toLang){ 
                  app.ApplyMatch( this.attributes['level'].value);
                }
                else {
                    app.ApplyMisMatch(this.attributes['fromlang'].value, this.attributes['level'].value);
                }
            }
        }
    });
};

function myHelper( event ) {
  return '<div id="draggableHelper">' + this.attributes['fromlang'].value + '</div>';
};