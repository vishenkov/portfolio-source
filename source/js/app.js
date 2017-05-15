(function() {
  function ready() {
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
      var total = 0;

      var incLoaded = () => {
        totalLoaded++;
     
        if (totalLoaded === (total-1)) {
          preloader.style.display = 'none';
          window.dispatchEvent(new Event('resize'));
        }
        preloader.innerHTML = Math.round(100*totalLoaded/total)+"%";
      }

      return {
        set : function(imagesArray) {
          if ((preloader == null) || (imagesArray == null)) return;

          total = imagesArray.length;
          
          for (var i = 0; i < total; i++) {
            var img = new Image();
            
            img.onload = function() {
              incLoaded();
              console.log("loaded");
            }
            img.onerror = function() {
              incLoaded();
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
        controlsUp = document.querySelectorAll('.works__control_up'),
        controlsDown = document.querySelectorAll('.works__control_down');

      var setRoundArray = (query) => {

        let roundArray = (function() {
          var 
            current = 0,
            limit = 0,
            prevIndex = 0,
            nextIndex = 0,
            query = [];
          return {
            inc: () => {
              prevIndex = current;
              current++;
              if (current > limit) {
                current = 0;
              }
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              return query[current];
            },
            dec: () => {
              prevIndex = current;
              current--;
              if (current < 0) {
                current = limit;
              }
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              return query[current];
            },
            get: () => {
              return query[current];
            },
            prev: () => {
              let ndx = (current - 1) < 0 ? limit : current - 1;
              return query[ndx];
            },
            next: () => {
              return query[nextIndex];
            },
            last: () => {
              return query[limit];
            },
            getIndex: () => {
              return current;
            },
            getAtIndex: (index) => {
              if ( (index >= 0) && (index <= limit)) return query[index];
              return -1;
            },
            length: () => {
              return limit;
            },
            init: (qArray) => {
              query = qArray;
              limit = query.length - 1;
              current = 0;
              nextIndex = (current + 1) > limit ? 0 : current + 1;
              prevIndex = (current - 1) < 0 ? limit : current - 1;
            }
          }
        })();
        roundArray.init(query);
        return roundArray;

      }

      var galleryInit = () => {

        techs.forEach(item => {
          item.innerHTML = prepareText(item);
        });
        titles.forEach(item => {
          item.firstElementChild.firstElementChild.firstElementChild.innerHTML = prepareText(item.firstElementChild.firstElementChild.firstElementChild);
        });
        titles = setRoundArray(titles);
        techs = setRoundArray(techs);
        hrefs = setRoundArray(hrefs);
        mainImages = setRoundArray(mainImages);
        controlsUp = setRoundArray(controlsUp);
        controlsDown = setRoundArray(controlsDown);

        controlsUp.inc();
        controlsDown.dec();

        updateView();
        controlsUp.get().classList.toggle('works_animation-slideupbottom');
        controlsDown.get().classList.toggle('works_animation-slidedowntop');
      }

      var updateView = () => {
        hrefs.get().classList.toggle('works__current');

        titles.get().classList.toggle('works__current');
        titles.get().firstElementChild.firstElementChild.firstElementChild.classList.toggle('works__text_animate');

        techs.get().classList.toggle('works__current');
        techs.get().classList.toggle('works__text_animate');

        mainImages.get().classList.toggle('works__current');
        mainImages.get().classList.toggle('works__mainimage_animate');

      }
      var cleanAnimations = () => {
        for (var i=0; i<=controlsDown.length(); i++) {
            controlsDown.getAtIndex(i).classList.remove('works_animation-slideupbottom');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slidedowntop');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slideup');
            controlsDown.getAtIndex(i).classList.remove('works_animation-slidedown');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slideupbottom');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slidedowntop');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slideup');
            controlsUp.getAtIndex(i).classList.remove('works_animation-slidedown');
          }
      }

      var galleryFlip = (diretion) => {
        updateView();
        if (diretion === 'up') {
          titles.inc();
          techs.inc();
          hrefs.inc();
          mainImages.inc();

          updateView();
          cleanAnimations();

          controlsUp.get().classList.add('works_animation-slideup');
          controlsUp.next().classList.add('works_animation-slideupbottom');

          controlsDown.get().classList.add('works_animation-slidedown');
          controlsDown.next().classList.add('works_animation-slidedowntop');

          controlsUp.inc();
          controlsDown.inc();
        } else {
          titles.dec();
          techs.dec();
          hrefs.dec();
          mainImages.dec();

          updateView();
          cleanAnimations();

          controlsDown.get().classList.add('works_animation-slideup');
          controlsDown.prev().classList.add('works_animation-slideupbottom');

          controlsUp.get().classList.add('works_animation-slidedown');
          controlsUp.prev().classList.toggle('works_animation-slidedowntop');

          controlsUp.dec();
          controlsDown.dec();
        }
      }

      var prepareText = (text) => {
        let words = text.innerText.trim().split(' ');
        let _words = [];

        words.forEach(word => {
          let splitWord = word.split('').map((char, index) => {
            return `<i>${char}</i>`;
          }).join('');
          _words.push(splitWord);
        });
        let formattedWords = _words.map((word, index) => {
          return `<span>${word}</span>`;
        }).join(' ');
        return formattedWords;
      }

      return {

        init: () => {
          if (document.querySelector('.works') != null) {
            galleryInit();
            document.querySelector('.works__arrow_down').onclick = function(e) {
              e.preventDefault();
              galleryFlip('down');
            };

            document.querySelector('.works__arrow_up').onclick = function(e) {
              e.preventDefault();
              galleryFlip('up');
            };
          }
        }
      }
    })();
    
    
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
  window.addEventListener("load", ready);
})();
