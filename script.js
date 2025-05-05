var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
  return cell !== '' && cell != null;
}
function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      var filteredData = jsonData.filter(row => row.some(filledCell));
      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      return csv;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  return gk_fileData[filename] || "";
}

var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width(), clientHeight = $(window).height();
var typewriterTimer;
var lyrics = [
  {"time": 12, "text": "Hmm"},
  {"time": 16, "text": "Khud pe sahara hai jaanam, tumhare sahare nahi hai"},
  {"time": 20, "text": "Dil ka ye darya la-faani hai, isme kinaare nahi hain"},
  {"time": 24, "text": "Qarz hai mere kuch tujhpar jo maine utaare nahi hain"},
  {"time": 28, "text": "Qarz hai tere kuch mujhpar wo tujhse to pyaare nahi hain"},
  {"time": 32, "text": "Kuchal diya phoolon ko tere inn qadmon ne"},
  {"time": 34, "text": "Jo bacha wo loota apnon ne"},
  {"time": 37, "text": "Ujadh to gaya mere baagh"},
  {"time": 38, "text": "Par baaki mehek hai, usse sabaq lu mein"},
  {"time": 39, "text": "Qalam toh bas rakh dun mein"},
  {"time": 41, "text": "Baandhun samaan apna, chal du mein"},
  {"time": 43, "text": "Kahi bhi baithun, bas tujhpe hi likhta hun"},
  {"time": 45, "text": "Dekho kitna besharam hun mein"},
  {"time": 47, "text": "Kuchal diya apne armaano ko"},
  {"time": 50, "text": "Masmaar kiya hai maikhaano ko"},
  {"time": 52, "text": "Iss baar tum aaye toh mein tumhe bhoolay se bhi ab na jaane du"},
  {"time": 57, "text": "Kuchal diya apne armaano ko"},
  {"time": 58, "text": "Masmaar kiya hai maikhaano ko"},
  {"time": 61, "text": "Ayaan hi nahi hoti mujhpe tum"},
  {"time": 62, "text": "Jis bhi taraf dekho"},
  {"time": 63, "text": "Jis bhi tarah dekhun"},
  {"time": 65, "text": "Dhoondha kinaaro pe kabhi"},
  {"time": 69, "text": "Dhoondhe sitaaron me kahin"},
  {"time": 74, "text": "Dhoondha bazaaron me tujhe"},
  {"time": 76, "text": "Qadawar pahaadon me kahin"},
  {"time": 81, "text": "Tu hai nahi, tu hai nahi"},
  {"time": 83, "text": "Tu ho ke bhi, kyun hai nahi?"},
  {"time": 86, "text": "Tu hai nahi, tu hai nahi"},
  {"time": 111, "text": "Tu ho ke bhi, kyun hai nahi?"},
  {"time": 115, "text": "Kitna sataaye teri yaadein hame"},
  {"time": 119, "text": "Par kya karein, ab kaafi khud ke liye"},
  {"time": 123, "text": "Gile na koi, na hai tujhse shikwe"},
  {"time": 127, "text": "The tumse pehle jaise, wohi rahay (Hmm)"},
  {"time": 131, "text": "Kho ke hi aani thi kya tum ko qadar?"},
  {"time": 135, "text": "Acha nahi lagta mujhko tera zikar"},
  {"time": 139, "text": "Ab ham jab mehfilon me baithe hotay aksar"},
  {"time": 143, "text": "Aur rehna hai hawa se ho ke befikar"},
  {"time": 147, "text": "Ham the kinaaron pe haan saath tere"},
  {"time": 151, "text": "Par tu toh panchi, udhe baadalon me"},
  {"time": 155, "text": "Hamne bhi jaane diya haathon se ye"},
  {"time": 159, "text": "Rishta jo jorr ke bhi na jurr sake"},
  {"time": 163, "text": "Mein hun wahin, mein hun wahin"},
  {"time": 167, "text": "Ab rehti hai teri kami"},
  {"time": 171, "text": "Mein hun wahin, mein hun wahin"},
  {"time": 175, "text": "Ab rehti hai teri kami"},
  {"time": 179, "text": "Dhoondha kinaaro pe kabhi"},
  {"time": 182, "text": "Dhoondhe sitaaron me kahin"}
];

$(function () {
  $loveHeart = $("#loveHeart");
  var offsetX = $loveHeart.width() / 2, offsetY = $loveHeart.height() / 2 - 55;
  $garden = $("#garden");
  gardenCanvas = $garden[0];
  gardenCanvas.width = $("#loveHeart").width() * window.devicePixelRatio;
  gardenCanvas.height = $("#loveHeart").height() * window.devicePixelRatio;
  gardenCanvas.style.width = $("#loveHeart").width() + 'px';
  gardenCanvas.style.height = $("#loveHeart").height() + 'px';
  gardenCtx = gardenCanvas.getContext("2d");
  gardenCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  gardenCtx.globalCompositeOperation = "lighter";
  garden = new Garden(gardenCtx, gardenCanvas);
  $("#content").css("width", $loveHeart.width() + $("#code").width());
  $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
  $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
  $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));
  setInterval(function () { garden.render(); }, Garden.options.growSpeed);

  particlesJS('particles-js', {
    particles: {
      number: { value: 20 },
      color: { value: '#ff4d4d' },
      shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
      opacity: { value: 0.5 },
      size: { value: 15, random: true },
      move: { enable: true, speed: 1, direction: 'top', out_mode: 'out' }
    },
    interactivity: { enable: false }
  });

  var audio = document.getElementById('backgroundAudio');
  audio.volume = 0.5;
  $('#playPauseBtn').on('click', function() {
    if (audio.paused) {
      audio.play().catch(function(e) {
        console.error('Play error:', e);
        $('#lyricsContainer').html('<p>Click again to play audio! 😊</p>').fadeIn();
      });
      $('#playPauseIcon').removeClass('fa-play').addClass('fa-pause');
      triggerMusicHearts();
      $('#lyricsContainer').fadeIn();
      $('#lyricsToggleBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
      audio.pause();
      $('#playPauseIcon').removeClass('fa-pause').addClass('fa-play');
      $('#lyricsContainer').fadeOut();
      $('#lyricsToggleBtn').find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
  });
  $('#muteBtn').on('click', function() {
    audio.muted = !audio.muted;
    $('#muteIcon').removeClass(audio.muted ? 'fa-volume-up' : 'fa-volume-mute').addClass(audio.muted ? 'fa-volume-mute' : 'fa-volume-up');
  });
  $('#volumeSlider').on('input', function() {
    audio.volume = this.value / 100;
    audio.muted = false;
    $('#muteIcon').removeClass('fa-volume-mute').addClass('fa-volume-up');
  });

  var seekSlider = $('#seekSlider');
  var currentTimeDisplay = $('#currentTime');
  var durationDisplay = $('#duration');
  audio.addEventListener('error', function() {
    console.error('Audio error:', audio.error);
    $('#lyricsContainer').html('<p>Audio file not found! Check romantic_song.mp3 😔</p>').fadeIn();
  });
  audio.addEventListener('loadedmetadata', function() {
    seekSlider.attr('max', audio.duration);
    durationDisplay.text(formatTime(audio.duration));
    renderLyrics();
    $('#lyricsContainer').fadeIn();
    $('#lyricsToggleBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
  });
  audio.addEventListener('timeupdate', function() {
    seekSlider.val(audio.currentTime);
    currentTimeDisplay.text(formatTime(audio.currentTime));
    updateLyrics(audio.currentTime);
  });
  seekSlider.on('input', function() {
    audio.currentTime = this.value;
    triggerSliderHearts();
  });

  $('#lyricsToggleBtn').on('click', function() {
    $('#lyricsContainer').slideToggle(300, function() {
      var isVisible = $('#lyricsContainer').is(':visible');
      $('#lyricsToggleBtn').find('i').removeClass(isVisible ? 'fa-chevron-down' : 'fa-chevron-up').addClass(isVisible ? 'fa-chevron-up' : 'fa-chevron-down');
    });
  });

  $('#favoriteLineBtn').on('click', function() {
    audio.currentTime = 111;
    if (audio.paused) {
      audio.play();
      $('#playPauseIcon').removeClass('fa-play').addClass('fa-pause');
      $('#lyricsContainer').fadeIn();
      $('#lyricsToggleBtn').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
    triggerHeartShower();
  });

  $.getJSON('lyrics.json', function(data) {
    lyrics = data.lyrics;
    renderLyrics();
  }).fail(function() {
    console.warn('Lyrics.json not found, using inline lyrics');
    renderLyrics();
  });

  var canvasClickCount = 0;
  $garden.on('click', function() {
    canvasClickCount++;
    if (canvasClickCount === 3) {
      $('#messages').html('<span style="animation: spin 1s infinite linear; display: inline-block;">❤️</span> Caught you staring, Saily!');
      setTimeout(() => { $('#messages').text('I Love You, Saily'); }, 2000);
      canvasClickCount = 0;
    }
  });

  var clickCount = 0;
  $('.signature').on('click', function() {
    clickCount++;
    if (clickCount === 5) {
      alert("Saily, you're my forever spark! ❤️");
      clickCount = 0;
    }
  });

  // Video slider functionality
  var currentSlide = 0;
  var totalSlides = $('.video-slide').length;
  var slider = $('.video-slider');
  var slideWidth = $('.video-slide').width();

  function updateSlider() {
    slider.css('transform', 'translateX(-' + (currentSlide * 100) + '%)');
  }

  $('.slider-btn.next').on('click', function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  });

  $('.slider-btn.prev').on('click', function() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  // Touch support for mobile devices
  var touchStartX = 0;
  var touchEndX = 0;

  slider.on('touchstart', function(e) {
    touchStartX = e.originalEvent.touches[0].clientX;
  });

  slider.on('touchend', function(e) {
    touchEndX = e.originalEvent.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    var swipeThreshold = 50;
    var diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left
        currentSlide = (currentSlide + 1) % totalSlides;
      } else {
        // Swipe right
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      }
      updateSlider();
    }
  }

  // Pause all videos when switching slides
  $('.slider-btn').on('click', function() {
    $('.video-slide video').each(function() {
      this.pause();
    });
  });
});

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function renderLyrics() {
  var container = $('#lyricsContainer');
  container.empty();
  if (lyrics.length === 0) {
    container.html('<p>No lyrics loaded 😔</p>').fadeIn();
    return;
  }
  lyrics.forEach(function(line) {
    $('<div>').addClass('lyric-line').text(line.text).appendTo(container);
  });
}

function updateLyrics(currentTime) {
  var container = $('#lyricsContainer');
  var lines = container.find('.lyric-line');
  var currentLine = null;
  lyrics.forEach(function(line, index) {
    if (currentTime >= line.time && (!lyrics[index + 1] || currentTime < lyrics[index + 1].time)) {
      currentLine = index;
    }
  });
  lines.removeClass('current');
  if (currentLine !== null) {
    lines.eq(currentLine).addClass('current');
    var scrollTop = lines.eq(currentLine).position().top - container.height() / 2 + lines.eq(currentLine).height() / 2;
    container.animate({ scrollTop: scrollTop }, 300);
  }
}

function triggerSliderHearts() {
  particlesJS('particles-js', {
    particles: {
      number: { value: 30 },
      color: { value: '#ff99cc' },
      shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 20, height: 20 } },
      opacity: { value: 0.8 },
      size: { value: 10, random: true },
      move: { enable: true, speed: 2, direction: 'top', out_mode: 'out' }
    },
    interactivity: { enable: false }
  });
  setTimeout(() => {
    particlesJS('particles-js', {
      particles: {
        number: { value: 20 },
        color: { value: '#ff4d4d' },
        shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
        opacity: { value: 0.5 },
        size: { value: 15, random: true },
        move: { enable: true, speed: 1, direction: 'top', out_mode: 'out' }
      },
      interactivity: { enable: false }
    });
  }, 1000);
}

$(window).resize(function() {
  if ($(window).width() != clientWidth && $(window).height() != clientHeight) {
    location.replace(location);
  }
});

function getHeartPoint(angle) {
  var t = angle / Math.PI;
  var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
  var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
  return [($("#loveHeart").width()/2)+x, ($("#loveHeart").height()/2 - 55)+y];
}

function startHeartAnimation() {
  var interval = 50, angle = 10, heart = [];
  var animationTimer = setInterval(function () {
    var bloom = getHeartPoint(angle), draw = true;
    for (var i = 0; i < heart.length; i++) {
      var p = heart[i];
      if (Math.sqrt(Math.pow(p[0]-bloom[0],2) + Math.pow(p[1]-bloom[1],2)) < Garden.options.bloomRadius.max*1.3) { draw = false; break; }
    }
    if (draw) { heart.push(bloom); garden.createRandomBloom(bloom[0], bloom[1]); }
    if (angle >= 30) {
      clearInterval(animationTimer);
      showMessages();
      $('#timeline').fadeIn(2000);
    } else { angle += 0.2; }
  }, interval);
}

(function($) {
  $.fn.typewriter = function() {
    this.each(function() {
      var $ele = $(this), str = $ele.html(), progress = 0;
      $ele.html('');
      typewriterTimer = setInterval(function() {
        var current = str.substr(progress, 1);
        if (current == '<') { progress = str.indexOf('>', progress) + 1; } else { progress++; }
        $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
        if (progress >= str.length) { clearInterval(typewriterTimer); }
      }, 75);
    });
    return this;
  };
})(jQuery);

function adjustCodePosition() { $('#code').css("margin-top", ($("#garden").height()-$("#code").height())/2); }
function adjustWordsPosition() { $('#words').css({ position:"absolute", top: $("#garden").position().top+195, left: $("#garden").position().left+70 }); }
function showMessages() {
  adjustWordsPosition();
  $('#messages').text('I Love You, Saily').fadeIn(5000, function(){ showLoveU(); });
}
function showLoveU() { $('#loveu').fadeIn(3000); }

function Vector(x, y) { this.x = x; this.y = y; }
Vector.prototype = {
  rotate: function(theta) { var x = this.x, y = this.y; this.x = Math.cos(theta)*x - Math.sin(theta)*y; this.y = Math.sin(theta)*x + Math.cos(theta)*y; return this; },
  mult: function(f) { this.x *= f; this.y *= f; return this; },
  clone: function() { return new Vector(this.x, this.y); },
  length: function() { return Math.sqrt(this.x*this.x + this.y*this.y); },
  subtract: function(v) { this.x -= v.x; this.y -= v.y; return this; },
  set: function(x, y) { this.x = x; this.y = y; return this; }
};

function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
  this.stretchA = stretchA;
  this.stretchB = stretchB;
  this.startAngle = startAngle;
  this.angle = angle;
  this.bloom = bloom;
  this.growFactor = growFactor;
  this.r = 1;
  this.isfinished = false;
}
Petal.prototype = {
  draw: function() {
    var ctx = this.bloom.garden.ctx;
    var v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
    var v2 = v1.clone().rotate(Garden.degrad(this.angle));
    var v3 = v1.clone().mult(this.stretchA);
    var v4 = v2.clone().mult(this.stretchB);
    ctx.strokeStyle = this.bloom.c;
    ctx.beginPath();
    ctx.moveTo(v1.x, v1.y);
    ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
    ctx.stroke();
  },
  render: function() { if (this.r <= this.bloom.r) { this.r += this.growFactor; this.draw(); } else { this.isfinished = true; } }
};

function Bloom(p, r, c, pc, garden) {
  this.p = p;
  this.r = r;
  this.c = c;
  this.pc = pc;
  this.petals = [];
  this.garden = garden;
  this.init();
  this.garden.addBloom(this);
}
Bloom.prototype = {
  draw: function() {
    var isfinished = true;
    this.garden.ctx.save();
    this.garden.ctx.translate(this.p.x, this.p.y);
    for (var i = 0; i < this.petals.length; i++) { this.petals[i].render(); isfinished *= this.petals[i].isfinished; }
    this.garden.ctx.restore();
    if (isfinished === true) { this.garden.removeBloom(this); }
  },
  init: function() {
    var angle = 360 / this.pc, startAngle = Garden.randomInt(0, 90);
    for (var i = 0; i < this.pc; i++) {
      this.petals.push(new Petal(
        Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
        Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max),
        startAngle + i * angle,
        angle,
        Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max),
        this
      ));
    }
  }
};

function Garden(ctx, element) { this.blooms = []; this.element = element; this.ctx = ctx; }
Garden.prototype = {
  render: function() { for (var i = 0; i < this.blooms.length; i++) { this.blooms[i].draw(); } },
  addBloom: function(b) { this.blooms.push(b); },
  removeBloom: function(b) { for (var i = 0; i < this.blooms.length; i++) { if (this.blooms[i] === b) { this.blooms.splice(i, 1); return; } } },
  createRandomBloom: function(x, y) {
    this.createBloom(
      x, y,
      Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max),
      Garden.rgba(
        Garden.randomInt(200, 255),
        Garden.randomInt(0, 100),
        Garden.randomInt(0, 100),
        Garden.options.color.opacity
      ),
      Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max)
    );
  },
  createBloom: function(x, y, r, c, pc) { new Bloom(new Vector(x, y), r, c, pc, this); },
  clear: function() { this.blooms = []; this.ctx.clearRect(0, 0, this.element.width, this.element.height); }
};
Garden.options = {
  petalCount: { min: 8, max: 15 },
  petalStretch: { min: 0.1, max: 3 },
  growFactor: { min: 0.1, max: 1 },
  bloomRadius: { min: 8, max: 10 },
  density: 10,
  growSpeed: 1000 / 60,
  color: { rmin: 200, rmax: 255, gmin: 0, gmax: 100, bmin: 0, bmax: 100, opacity: 0.3 },
  tanAngle: 60
};
Garden.random = function(min, max) { return Math.random() * (max - min) + min; };
Garden.randomInt = function(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
Garden.circle = 2 * Math.PI;
Garden.degrad = function(angle) { return Garden.circle / 360 * angle; };
Garden.rgba = function(r, g, b, a) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
Garden.randomrgba = function(rmin, rmax, gmin, gmax, bmin, bmax, a) {
  var r = Math.round(Garden.random(rmin, rmax)),
      g = Math.round(Garden.random(gmin, gmax)),
      b = Math.round(Garden.random(bmin, bmax));
  return Garden.rgba(r, g, b, a);
};

function skipAnimation() {
  clearTimeout(window.animationTimeout);
  if (typewriterTimer) { clearInterval(typewriterTimer); }
  var codeElement = document.getElementById('code');
  var originalHtml = codeElement.getAttribute('data-original-html');
  if (originalHtml) { codeElement.innerHTML = originalHtml; }
  adjustWordsPosition();
  $('#messages').text('I Love You, Saily').show();
  $('#loveu').show();
  $('#timeline').show();
  garden.clear();
  for (var angle = 10; angle <= 30; angle += 0.2) {
    var bloom = getHeartPoint(angle);
    garden.createRandomBloom(bloom[0], bloom[1]);
  }
}

function showQuote() { $('#quoteModal').fadeIn(500); }

function triggerHeartShower() {
  var chime = document.getElementById('heartChime');
  chime.play();
  particlesJS('particles-js', {
    particles: {
      number: { value: 100 },
      color: { value: ['#ff4d4d', '#ff99cc', '#D81B60'] },
      shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
      opacity: { value: 0.7 },
      size: { value: 20, random: true },
      move: { enable: true, speed: 3, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: { enable: false }
  });
  $('#messages').text('For My Saily ❤️');
  setTimeout(() => {
    particlesJS('particles-js', {
      particles: {
        number: { value: 20 },
        color: { value: '#ff4d4d' },
        shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
        opacity: { value: 0.5 },
        size: { value: 15, random: true },
        move: { enable: true, speed: 1, direction: 'top', out_mode: 'out' }
      },
      interactivity: { enable: false }
    });
    $('#messages').text('I Love You, Saily');
  }, 3000);
}

function triggerMusicHearts() {
  particlesJS('particles-js', {
    particles: {
      number: { value: 50 },
      color: { value: '#ff99cc' },
      shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
      opacity: { value: 0.6 },
      size: { value: 10, random: true },
      move: { enable: true, speed: 2, direction: 'top', out_mode: 'out' }
    },
    interactivity: { enable: false }
  });
  setTimeout(() => {
    particlesJS('particles-js', {
      particles: {
        number: { value: 20 },
        color: { value: '#ff4d4d' },
        shape: { type: 'image', image: { src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', width: 30, height: 30 } },
        opacity: { value: 0.5 },
        size: { value: 15, random: true },
        move: { enable: true, speed: 1, direction: 'top', out_mode: 'out' }
      },
      interactivity: { enable: false }
    });
  }, 2000);
}

$(function(){ 
  var codeElement = document.getElementById('code');
  codeElement.setAttribute('data-original-html', codeElement.innerHTML);
  window.animationTimeout = setTimeout(function(){ startHeartAnimation(); }, 5000); 
  adjustCodePosition(); 
  $("#code").typewriter(); 
});