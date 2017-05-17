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
              document.querySelector('.button__link_flipper').classList.toggle('button__link_active');
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
    
    var blogToC = (function () {
      var 
        toc = null,
        links = null,
        offsetContent = 0,
        articlesHeights = [],
        offsetArticles = [],
        offsetMargin = 60;

        var tocScroll = (e) => {
          if (window.scrollY > offsetContent) {
            // toc.classList.add('blog__menu_sticky');
            toc.style.top = "0";
            offsetArticles.forEach((offset, index) => {
              if ((window.scrollY > offset- offsetMargin) && ((offset + articlesHeights[index]-offsetMargin) > window.scrollY)) {
                links[index].classList.add('blog-menu__link_selected');
              } else {
                links[index].classList.remove('blog-menu__link_selected');
              }
            });

            let footerHeight = document.querySelector('.footer').clientHeight;
            if (toc.clientHeight > (window.innerHeight-footerHeight)) {
              let menuoffset = (toc.clientHeight - (window.innerHeight - footerHeight - 20)) * (window.scrollY / document.body.clientHeight);
              toc.style.top = -menuoffset + 'px';
            } else {
              toc.style.top = 0;
            }

          } else {
            toc.style.top = offsetContent- window.scrollY + 'px';
          }
        }

      return {
        init: () => {
          toc = document.querySelector('.blog__menu');
          if (toc == null) return;
          toc.style.top = offsetContent- window.scrollY + 'px';
          links = toc.querySelectorAll('.blog-menu__link');
          links[0].classList.add('blog-menu__link_selected');
          offsetContent = document.querySelector('.content').offsetTop;
          offsetArticles = [];
          articlesHeights = [];

          document.querySelectorAll('.article__content').forEach((article, index) => {
            offsetArticles.push(article.offsetTop);
            articlesHeights.push(article.offsetHeight);
          });
          console.log("offsetContent: "+offsetContent + "\n offsetArticles: " +offsetArticles+" \n articlesHeights: "+ articlesHeights);
          window.addEventListener('scroll', tocScroll);
          tocScroll();
        }
      }
    })();

    var blogSwipeMenu = (function (){
      var btn = null;
      var menu = null;
      var offsetContent = 0;

      var btnclick = () => {
        menu.classList.toggle('columns__left_blog-swiped');
        let btnstyle = getComputedStyle(btn);
        let menustyle = getComputedStyle(menu);

        if (btn.offsetLeft > 0) {
          btn.style.left = (-1*parseInt(btnstyle.width, 10) / 2) + 'px';
        } else {
          btn.style.left = ((parseInt(menustyle.width, 10)) - parseInt(btnstyle.width, 10) / 2) + 'px';
        }
          
      }
      var calcBtnOffsetLeft = () => {
        
      }
      var btnscroll = () => {
        if (window.scrollY > offsetContent) {
          btn.style.top = "50%";
        } else {
          btn.style.top = Math.max(window.innerHeight/2, offsetContent- window.scrollY) + 'px';
        }

      }

      return {
        init: () => {
          btn = document.querySelector('.blog__swipe');
          if (btn == null) return;
          offsetContent = document.querySelector('.content').offsetTop;
          btn.style.top = Math.max(window.innerHeight/2, offsetContent- window.scrollY) + 'px';
          if (btn.offsetLeft > 0) {
            btn.click();
          }
          menu = document.querySelector('.columns__left_blog');
          btn.addEventListener('click', btnclick);
          window.addEventListener('scroll', btnscroll);
          btnscroll();
        }
      }
    })();

    initMap();
    mouseParallax.init();
    scrollParallax.init();
    gallery.init();
    flip.init();
    blur.set();
    blogToC.init();
    blogSwipeMenu.init();

    window.addEventListener('resize', (e) =>{
      blur.set();
      flip.init();
      blogToC.init();
      blogSwipeMenu.init();
    });
  }
  function DOMReady () {
    var preloader = (function() {
      var preloads = document.querySelectorAll('.preload');
      var preloader = null;
      var percentText = null;
      var totalLoaded = 0;
      var total = 0;

      var incLoaded = () => {
        totalLoaded++;
     
        if (totalLoaded === (total)) {
          destroyPreloader();
        }
        if (percentText != null) {
          percentText.innerHTML = Math.round(100*totalLoaded/total)+"%";
        // console.log(Math.round(100*totalLoaded/total)+"%")
        }
      }

      var createPreloader = () => {
        preloader = document.createElement('div');
        preloader.className = 'preloader';

        let spinner = document.createElement('div');
        spinner.className = 'preloader__spinner';
        preloader.appendChild(spinner);

        let anim = document.createElement('div');
        anim.className = 'preloader__animation';
        spinner.appendChild(anim);

        percentText = document.createElement('div');
        percentText.className = 'preloader__percents';
        spinner.appendChild(percentText);

        document.body.appendChild(preloader);
      }

      var destroyPreloader = () => {
        let allPreloaders = document.querySelectorAll('.preloader');
        if (allPreloaders == null) return;
        allPreloaders.forEach((item) => {
          item.parentNode.removeChild(item);
        });
      }

      return {
        init : () => {
          if (preloads.length === 0) return;
          //console.log(preloads);
          total = preloads.length;
          createPreloader();
          percentText.innerHTML = "0%";
          totalLoaded = 0;

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
              style = preloads[i].currentStyle || window.getComputedStyle(preloads[i], false),
              src = style.backgroundImage.slice(4, -1);
            
            src = src.replace(/('|")/g,'');
            img.src = src;
          }
        }
      }

    }());

    var arrowLinksInit = (function (){
      var scrollWindowDown = (e) => {
        e.preventDefault();
        let offsetHeight = document.body.clientHeight - window.innerHeight;
        if (offsetHeight > 0) {
          window.scrollTo(0, offsetHeight);
        }
      }
      var scrollWindowUp = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
      }
      return {
        init:() => {
          let arrowUp = document.querySelector('.arrow__up');
          let arrowDown = document.querySelector('.arrow__down');
          if (arrowUp != null) {
            arrowUp.addEventListener('click', scrollWindowUp);
          }
          if (arrowDown != null) {
            arrowDown.addEventListener('click', scrollWindowDown);
          }
        }
      }
    })();

    

    preloader.init();
    arrowLinksInit.init();
    

  }
  window.addEventListener("load", ready);
  window.addEventListener("DOMContentLoaded", DOMReady);  
})();
      function initMap() {
        var belgorod = {lat: 50.59460565204478, lng: 36.599270610589656};
        var marker = {lat: 50.6, lng: 36.5992};
        var mapOptions = 
[
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#373e42"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape",
    "stylers": [
      {
        "color": "#eff0ea"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#efeee9"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#efeee9"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#373e42"
      }
    ]
  },
  {
    "featureType": "poi.attraction",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.government",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.medical",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#479686"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "poi.place_of_worship",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.school",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#455a64"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#d6d6d6"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#009688"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#009688"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#d5d6d7"
      },
      {
        "lightness": 5
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#373e42"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#00bfa5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
]
      if ((google!= null) && (document.querySelector('.googlemap')!=null)) {
        var map = new google.maps.Map(document.querySelector('.googlemap'), {
          center: belgorod,
          zoom: 15,
          styles: mapOptions,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        });
        var image = '/assets/img/map-marker.png';
        var marker = new google.maps.Marker({
          position: marker,
          map: map,
          icon: image
        });
        }
      }