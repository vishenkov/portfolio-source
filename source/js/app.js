(function() {

  var mouseParallax = (function (){
    var parallax = document.querySelector('.parallax');
    var mouseMove = (e) => {
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


    return {
      init: () => {
        if (parallax != null) {
          window.addEventListener('mousemove', mouseMove);
        }
      }
    }
  })();

  var scrollParallax = (function (){
     var bg = document.getElementsByClassName('parallax-scroll');
     var scrollFunction = (e) => {
      if (bg.length>0) {
        for (var i = 0; i < bg.length; i++) {
          bg[i].style.transform = "translate3d(0,"+window.pageYOffset/((i+1)*2)+"px,"+ "0)";
        }
      }
     }

    return {
      init: () => {
        if (bg != null) {
          window.addEventListener('scroll', scrollFunction);
        }
      }
    }
  })();

  var preloader = (function(){
    var preloader = document.querySelector('.preloader');
    var totalLoaded = 0;

    var incLoaded = () => totalLoaded++;
    var checkLoads = (total) => {
      if (totalLoaded === total) {
        preloader.style.display = 'none';
        window.dispatchEvent(new Event('resize'));
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
          img.onerror = function() {
            incLoaded();
            checkLoads(imagesArray.length);
            console.log("load error");
          }

          var 
            style = imagesArray[i].currentStyle || window.getComputedStyle(imagesArray[i], false),
            src = style.backgroundImage.slice(4, -1);
          
          src = src.replace(/('|")/g,'');
          img.src = src;
        }
      }
    }

  }());

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

  
  var flip = (function () {
    var flipper = document.querySelector('.flipper');

    var setFlipperDimentions = () => {
      var 
        front = getComputedStyle(flipper.querySelector('.flipper__side').firstElementChild),
        back = getComputedStyle(flipper.querySelector('.flipper__side').lastElementChild);

        flipper.style.width = Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + 'px';
        console.log( Math.max(parseInt(front.width, 10), parseInt(back.width, 10)) + " "+ Math.max(parseInt(front.height, 10), parseInt(back.height, 10)));
        flipper.style.height = Math.max(parseInt(front.height, 10), parseInt(back.height, 10))+ 'px';
    };
    var doFlip = () => {
      flipper.classList.toggle('flipper_flip');
    }
    
    return {
      init: () => {
        if (flipper != null) {
          setFlipperDimentions();
          document.querySelector('.button__link_flipper').onclick = function(e) {
            doFlip();
            this.classList.toggle('button__link_active');
          };
           document.querySelector('.form__button_flip').onclick = function(e) {
            doFlip();
          };
        }
      }
    }
  })();

  var gallery = (function () {
    var
      titles = document.querySelectorAll('.works__title-item'),
      techs = document.querySelectorAll('.works__tech-item'),
      hrefs = document.querySelectorAll('.works__href-item'),
      mainImages = document.querySelectorAll('.works__mainimage-item'),
      controlUp = document.querySelector('.works__control_up'),
      controlDown = document.querySelector('.works__control_down'),
      imgUrls = [],
      currentItem = 0;

    var galleryInit = () => {

      updateView(0);

      for (var i = 0; i < mainImages.length; i++) {
        imgUrls[i] = mainImages[i].firstElementChild.getAttribute('src');
        // console.log(imgUrls[i]);
      }

      controlUp.style.backgroundImage = "url(\"" + imgUrls[1] + "\")";
      controlDown.style.backgroundImage = "url(\"" + imgUrls[imgUrls.length - 1]+ "\")";

      // console.log(controlUp);
    }

    var galleryFlip = (diretion) => {

      updateView(currentItem);

      if (diretion === 'up') {
        updateControlDown(imgUrls[currentItem]);
        currentItem++;
        if (currentItem > mainImages.length - 1) {
          currentItem = 0;
        }
        var computedUrl = ((currentItem + 1) === imgUrls.length) ? imgUrls[0]:imgUrls[currentItem + 1];
        updateControlUp(computedUrl);
      } else {
        updateControlUp(imgUrls[currentItem]);
        currentItem--;
        if (currentItem < 0) {
          currentItem = mainImages.length - 1;
        }
        var computedUrl = ((currentItem - 1) < 0) ? imgUrls[imgUrls.length - 1]:imgUrls[currentItem - 1];
        updateControlDown(computedUrl);
      }
      updateView(currentItem);
    }

    var updateView = (counter) => {
      titles[counter].classList.toggle('works__current');
      techs[counter].classList.toggle('works__current');
      hrefs[counter].classList.toggle('works__current');
      mainImages[counter].classList.toggle('works__current');
    }

    var updateControlUp = (url) => {
      controlUp.style.backgroundImage = "url(\"" + url + "\")";
    }

    var updateControlDown = (url) => {
      controlDown.style.backgroundImage = "url(\"" + url + "\")";
    }

    return {

      init: () => {
        if (document.querySelector('.works') != null) {
          galleryInit();
          document.querySelector('.works__arrow_down').onclick = function(e) {
            e.preventDefault();
            // console.log("arrow down");
            galleryFlip('down');
          };

          document.querySelector('.works__arrow_up').onclick = function(e) {
            e.preventDefault();
            // console.log("arrow up");
            galleryFlip('up');
          };
        }
      }
    }
  })();
  

  function ready() {
    mouseParallax.init();
    scrollParallax.init();
    gallery.init();
    flip.init();
    blur.set();
    preloader.set(document.getElementsByClassName("layer"));

    window.addEventListener('resize', (e) =>{
      blur.set();
      flip.init();
      preloader.set(document.getElementsByClassName("layer"));
    });
  }
  document.addEventListener("DOMContentLoaded", ready);
})();
