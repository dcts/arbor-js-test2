//
//  main.js
//
//  A project template for using arbor.js
//

(function($){


  var imgOrganisation = new Image();
  imgOrganisation.src = "https://www.moneyhouse.ch/assets/icons/company_active.svg";
  var imgPerson = new Image();
  imgPerson.src = "https://www.moneyhouse.ch/assets/icons/person_active.svg";

  var Renderer = function(canvas){
    var canvas = $(canvas).get(0)
    var ctx = canvas.getContext("2d");
    var particleSystem
    ctx.scale(1, 1)

    var that = {
      init:function(system){
        //
        // the particle system will call the init function once, right before the
        // first frame is to be drawn. it's a good place to set up the canvas and
        // to pass the canvas size to the particle system
        //
        // save a reference to the particle system for use in the .redraw() loop
        particleSystem = system

        // inform the system of the screen dimensions so it can map coords for us.
        // if the canvas is ever resized, screenSize should be called again with
        // the new dimensions
        particleSystem.screenSize(canvas.width, canvas.height)
        particleSystem.screenPadding(120) // leave an extra 80px of whitespace per side

        // set up some event handlers to allow for node-dragging
        that.initMouseHandling()
      },

      redraw:function(){
        //
        // redraw will be called repeatedly during the run whenever the node positions
        // change. the new positions for the nodes can be accessed by looking at the
        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
        // of the particle system rather than the screen. you can either map them to
        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
        // which allow you to step through the actual node objects but also pass an
        // x,y point in the screen's coordinate system
        //
        ctx.fillStyle = "white"
        ctx.fillRect(0,0, canvas.width, canvas.height)

        ctx.fillStyle = "green"

        particleSystem.eachEdge(function(edge, pt1, pt2){
          // edge: {source:Node, target:Node, length:#, data:{}}
          // pt1:  {x:#, y:#}  source position in screen coords
          // pt2:  {x:#, y:#}  target position in screen coords

          // draw a line from pt1 to pt2
          ctx.strokeStyle = "rgba(0,0,0, .333)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(pt1.x, pt1.y)
          ctx.lineTo(pt2.x, pt2.y)
          ctx.stroke()
        })

        particleSystem.eachNode(function(node, pt){
          // node: {mass:#, p:{x,y}, name:"", data:{}}
          // pt:   {x:#, y:#}  node position in screen coords

          // draw a rectangle centered at pt
          var w = 10
          // ctx.fillStyle = (node.data.alone) ? "orange" : "black"
          // ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w)
          if (node.data.type === "person") {
            ctx.drawImage(imgPerson, pt.x-w/2, pt.y-w/2);
          } else if (node.data.type === "foundation" ) {
            ctx.drawImage(imgOrganisation, pt.x-w/2, pt.y-w/2);
          }

          ctx.font = "10px Helvetica";
          ctx.fillText("Person X", pt.x-w/2, pt.y-w/2);

          // ctx.fillStyle("black");
          // ctx.font = "15px Arial";
          // // Show the different textAlign values
          // // ctx.textAlign = "start";
          // ctx.textAlign = "center";
          // ctx.fillText("textAlign=start", 150, 60);


        })
      },

      initMouseHandling:function(){
        // no-nonsense drag and drop (thanks springy.js)
        var dragged = null;

        // set up a handler object that will initially listen for mousedowns then
        // for moves and mouseups while dragging
        var handler = {
          clicked:function(e){
            var pos = $(canvas).offset();
            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
            dragged = particleSystem.nearest(_mouseP);

            if (dragged && dragged.node !== null){
              // while we're dragging, don't let physics move the node
              dragged.node.fixed = true
            }

            $(canvas).bind('mousemove', handler.dragged)
            $(window).bind('mouseup', handler.dropped)

            return false
          },
          dragged:function(e){
            var pos = $(canvas).offset();
            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

            if (dragged && dragged.node !== null){
              var p = particleSystem.fromScreen(s)
              dragged.node.p = p
            }

            return false
          },

          dropped:function(e){
            if (dragged===null || dragged.node===undefined) return
            if (dragged.node !== null) dragged.node.fixed = false
            dragged.node.tempMass = 1000
            dragged = null
            $(canvas).unbind('mousemove', handler.dragged)
            $(window).unbind('mouseup', handler.dropped)
            _mouseP = null
            return false
          }
        }

        // start listening
        $(canvas).mousedown(handler.clicked);

      },

    }
    return that
  }

  $(document).ready(function(){
    var sys = arbor.ParticleSystem(1000, 2400, 0.5, true, 55, 0.02, 0.6) // create the system with sensible repulsion/stiffness/friction
    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

    // add some nodes to the graph and watch it go...
    sys.addNode("f1", {"type": "foundation"});
    sys.addNode("f2", {"type": "foundation"});
    sys.addNode("f3", {"type": "foundation"});
    sys.addNode("f4", {"type": "foundation"});
    sys.addNode("f5", {"type": "foundation"});
    sys.addNode("pMain", {"type": "person"});
    sys.addNode("p2", {"type": "person"});
    sys.addNode("p3", {"type": "person"});
    sys.addNode("p4", {"type": "person"});
    sys.addNode("p5", {"type": "person"});
    sys.addNode("p6", {"type": "person"});
    sys.addNode("p7", {"type": "person"});
    sys.addNode("p8", {"type": "person"});
    sys.addNode("p9", {"type": "person"});
    sys.addNode("p10", {"type": "person"});
    sys.addNode("p11", {"type": "person"});
    sys.addNode("p12", {"type": "person"});
    sys.addNode("p13", {"type": "person"});
    sys.addNode("p14", {"type": "person"});
    sys.addNode("p15", {"type": "person"});

    // add edges
    sys.addEdge('pMain','f1')
    sys.addEdge('pMain','f2')
    sys.addEdge('pMain','f3')
    sys.addEdge('pMain','f4')
    sys.addEdge('pMain','f5')
    sys.addEdge('p2','f1')
    sys.addEdge('p3','f1')
    sys.addEdge('p4','f1')
    sys.addEdge('p5','f2')
    sys.addEdge('p6','f2')
    sys.addEdge('p7','f2')
    sys.addEdge('p8','f3')
    sys.addEdge('p9','f3')
    sys.addEdge('p10','f4')
    sys.addEdge('p11','f4')
    sys.addEdge('p12','f4')
    sys.addEdge('p13','f4')
    sys.addEdge('p14','f5')
    sys.addEdge('p15','f5')


    // or, equivalently:
    //
    // sys.graft({
    //   nodes:{
    //     f:{alone:true, mass:.25}
    //   },
    //   edges:{
    //     a:{ b:{},
    //         c:{},
    //         d:{},
    //         e:{}
    //     }
    //   }
    // })
  })

})(this.jQuery)
