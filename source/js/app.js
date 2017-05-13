(function() {

  window.onmousemove= function (e) {
    var
      parallax = document.querySelector('.parallax');
    if (parallax!=null) {
      var
        layers =  parallax.getElementsByClassName('layer'),
        computedStyle = getComputedStyle(parallax),
        width = parseInt(computedStyle.width, 10),
        height = parseInt(computedStyle.height, 10),
        parallaxPercent = 5,
        maxOffsetX = parallaxPercent*width/100,
        maxOffsetY = parallaxPercent*height/100;

      for (var i = 0; i < layers.length; i++) {
        var
          layer = layers[i],
          depth = layer.dataset.depth,
          translateX = -(e.clientX-width/2)/(width/2)*maxOffsetX*depth,
          translateY = -(e.clientY-height/2)/(height/2)*maxOffsetY*depth;

        var transform = "translate3d("+translateX + "px,"+translateY+"px,"+ "0)";
        layer.style.transform = transform;
        layer.style.webkitTransform = transform;
      }
    }
  }

  window.onscroll= function (e) {
    var bg = document.getElementsByClassName('parallax-scroll');
    //console.log(window.pageYOffset);
      if (bg.length>0) {
        //console.log(window.pageYOffset);
        for (var i = 0; i < bg.length; i++) {
          bg[i].style.transform = "translate3d(0,"+window.pageYOffset/((i+1)*2)+"px,"+ "0)";
        }
      }
  }

  var preloader = (function(){
    var preloader = document.querySelector('.preloader');
    var totalLoaded = 0;

    var incLoaded = () => totalLoaded++;
    var checkLoads = (total) => {
      if (totalLoaded === total) {
        preloader.style.display = 'none';
      }
      preloader.innerHTML = Math.round(100*totalLoaded/total)+"%";
    }

    return {
      set : function(imagesArray) {
        if ((preloader == null) || (imagesArray == null)) return;
        
        for (var i = 0; i < imagesArray.length; i++) {
          var img = new Image();
          
          img.onload = function() {
            incLoaded();
            checkLoads(imagesArray.length);
            console.log("loaded");
          }

          var 
            style = imagesArray[i].currentStyle || window.getComputedStyle(imagesArray[i], false),
            src = style.backgroundImage.slice(4, -1);
          // console.log("before: "+src);
          // src = src.substring(src.indexOf("/assets"), src.length - 1);
          // console.log("after: "+src);
          src = src.replace(/('|")/g,'');
          //preloader.innerHTML += src;
          img.src = src;
        }
      }
    }

  }());

  preloader.set(document.getElementsByClassName("layer"));

  var blur = (function () {
    var blur = document.querySelector('.blur'),
        contactme = document.querySelector('.contactme'),
        modal = document.querySelector('.modal_contactme');

    return {
      set: function() {
        if (blur!=null) {
          var
            posLeft = -contactme.offsetLeft,
            offsetTop = -(contactme.offsetTop-parseInt(getComputedStyle(modal).backgroundPositionY, 10));

          //TODO: get img dementions from bg url
          var imgWidth = 2000,
              imgHeight = 1699,
              modalWidth = modal.clientWidth,
              modalHeight = modal.clientHeight,
              imgRatio = (imgHeight / imgWidth),
              modalRatio = (modalHeight / modalWidth),
              bgCoverWidth = 0,
              bgCoverHeight = 0;
          
          if (modalRatio > imgRatio) {
              bgCoverHeight = modalHeight;
              bgCoverWidth = (modalHeight / imgRatio);
          } 
          else {
              bgCoverWidth = modalWidth;
              bgCoverHeight = (modalWidth * imgRatio);
          }
          
          blur.style.backgroundSize = bgCoverWidth + 'px ' + bgCoverHeight + 'px';
          blur.style.backgroundPositionX = posLeft + 'px';
          blur.style.backgroundPositionY = offsetTop + 'px';
        }
      }
    }
  }());

  blur.set();

  window.onresize = function () {
    blur.set();
  }

  var setFlipperDimentions = () => {
      var flipper = document.querySelector('.flipper');
      var 
        front = getComputedStyle(flipper.querySelector('.flipper__side').firstElementChild),
        back = getComputedStyle(flipper.querySelector('.flipper__side').lastElementChild);

        flipper.style.width = Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + 'px';
        console.log( Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + " "+ Math.max(parseInt(front.height, 10), parseInt(back.height, 10)));
        flipper.style.height = Math.max(parseInt(front.height, 10), parseInt(back.height, 10))+ 'px';
    };
    setFlipperDimentions();

  document.querySelector('.button__link_flipper').onclick = function(e){
    var flipper = document.querySelector('.flipper');
    flipper.classList.toggle('flipper_flip');
    setTimeout(function(){
      flipper.querySelector('.flipper__side_front').classList.toggle('flipper__side_active');
    flipper.querySelector('.flipper__side_back').classList.toggle('flipper__side_active');
    },600);
    // flipper.querySelector('.flipper__side_front').classList.toggle('flipper__side_active');
    // flipper.querySelector('.flipper__side_back').classList.toggle('flipper__side_active');
    this.classList.toggle('button__link_active');
    
  };

})();
