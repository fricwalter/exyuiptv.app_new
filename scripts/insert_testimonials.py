import sys
sys.stdout.reconfigure(encoding='utf-8')

TESTIMONIAL_SECTION = '''
<!-- ===== TESTIMONIALS MARQUEE ===== -->
<style>
@keyframes marqueeScroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track          { animation: marqueeScroll 28s linear infinite; }
.marquee-track-reverse  { animation: marqueeScroll 28s linear infinite reverse; }
.marquee-track:hover,
.marquee-track-reverse:hover { animation-play-state: paused; }
</style>

<section class="py-20 bg-stone-900 overflow-hidden">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
    <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
      \u0160ta ka\u017eu na\u0161i
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> korisnici</span>?
    </h2>
    <p class="text-gray-400 text-lg max-w-xl mx-auto">
      Hiljade zadovoljnih korisnika iz dijaspore \u2014 pogledajte njihova iskustva.
    </p>
  </div>

  <!-- Row 1 left to right -->
  <div class="relative w-full overflow-hidden mb-4">
    <div class="pointer-events-none absolute left-0 top-0 h-full w-28 z-10" style="background:linear-gradient(to right,#1c1917,transparent)"></div>
    <div class="flex marquee-track" style="width:max-content">

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60" alt="Marko">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Marko Petrovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@marko_njemacka &middot; Frankfurt</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Kona\u010dno gledam Arena Sport i RTS bez ikakvog problema. Slika je savr\u0161ena \u010dak i u 4K. Preporu\u010dujem svima u Njema\u010dkoj!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60" alt="Ana">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Ana Kova\u010devi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@ana_bec &middot; Wien</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Testiram ve\u0107 3 godine razne IPTV servise. Ovaj je daleko najbolji \u2014 bez zamrzavanja, podr\u0161ka odmah odgovara. Vrijednost za novac je odli\u010dna.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60" alt="Emir">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Emir Had\u017ei\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@emir_london &middot; London</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">BHT1, FTV, Hayat \u2014 sve radi besprijekorno. Moja porodica iz BiH bi rekla da je signal bolji nego kod njih na kablovskoj! Svaka preporuka.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60" alt="Jelena">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Jelena Nikoli\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@jelena_zurich &middot; Z\u00fcrich</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Naru\u010dila sam za cijelu porodicu \u2014 3 konekcije. Svako gleda \u0161ta ho\u0107e, nema bufferinga. Mu\u017e prati utakmice, ja serije, djeca crta\u0107e. Savr\u0161eno!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60" alt="Stefan">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Stefan Jovanovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@stefan_amsterdam &middot; Amsterdam</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Pratim sve utakmice srpske reprezentacije i Superlige. Pre\u0161ao sam sa konkurencije \u2014 razlika je ogromna. Preporu\u010dujem svim Srbima u Holandiji!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60" alt="Sabina">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Sabina Muji\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@sabina_malmo &middot; Malm\u00f6</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Instalacija je trajala bukvalno 5 minuta na Smart TV-u. Podr\u0161ka je bila tu odmah kada sam imala pitanje. Nevjerovatna usluga za ovaj novac!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <!-- DUPLICATE SET for seamless infinite loop -->
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60" alt="Marko">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Marko Petrovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@marko_njemacka &middot; Frankfurt</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Kona\u010dno gledam Arena Sport i RTS bez ikakvog problema. Slika je savr\u0161ena \u010dak i u 4K. Preporu\u010dujem svima u Njema\u010dkoj!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60" alt="Ana">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Ana Kova\u010devi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@ana_bec &middot; Wien</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Testiram ve\u0107 3 godine razne IPTV servise. Ovaj je daleko najbolji \u2014 bez zamrzavanja, podr\u0161ka odmah odgovara. Vrijednost za novac je odli\u010dna.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60" alt="Emir">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Emir Had\u017ei\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@emir_london &middot; London</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">BHT1, FTV, Hayat \u2014 sve radi besprijekorno. Moja porodica iz BiH bi rekla da je signal bolji nego kod njih na kablovskoj! Svaka preporuka.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60" alt="Jelena">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Jelena Nikoli\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@jelena_zurich &middot; Z\u00fcrich</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Naru\u010dila sam za cijelu porodicu \u2014 3 konekcije. Svako gleda \u0161ta ho\u0107e, nema bufferinga. Mu\u017e prati utakmice, ja serije, djeca crta\u0107e. Savr\u0161eno!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60" alt="Stefan">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Stefan Jovanovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@stefan_amsterdam &middot; Amsterdam</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Pratim sve utakmice srpske reprezentacije i Superlige. Pre\u0161ao sam sa konkurencije \u2014 razlika je ogromna. Preporu\u010dujem svim Srbima u Holandiji!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-blue-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=60" alt="Sabina">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Sabina Muji\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@sabina_malmo &middot; Malm\u00f6</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Instalacija je trajala bukvalno 5 minuta na Smart TV-u. Podr\u0161ka je bila tu odmah kada sam imala pitanje. Nevjerovatna usluga za ovaj novac!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

    </div>
    <div class="pointer-events-none absolute right-0 top-0 h-full w-28 z-10" style="background:linear-gradient(to left,#1c1917,transparent)"></div>
  </div>

  <!-- Row 2 right to left (reverse) -->
  <div class="relative w-full overflow-hidden">
    <div class="pointer-events-none absolute left-0 top-0 h-full w-28 z-10" style="background:linear-gradient(to right,#1c1917,transparent)"></div>
    <div class="flex marquee-track-reverse" style="width:max-content">

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=60" alt="Dino">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Dino Mehi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@dino_chicago &middot; Chicago</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Live sport iz Evrope gledam ovde u Americi bez VPN-a! Fudbal, ko\u0161arka, rukomet \u2014 sve je tu. Odli\u010dna latencija i bez zaostajanja slike.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop&q=60" alt="Maja">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Maja Stojanovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@maja_brussels &middot; Bruxelles</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Gledam Pink, Happy i Prva TV kao da sam u Beogradu. Besplatni test me je odmah uvjerio \u2014 naru\u010dila sam godi\u0161nju pretplatu. Nikako se ne kajem!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=60" alt="Haris">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Haris Bajri\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@haris_sydney &middot; Sydney</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Iz Australije pratim Premijer ligu BiH u\u017eivo! Vremenska razlika je problem ali stream radi savr\u0161eno 24/7. Podr\u0161ka je odgovorila za 10 minuta.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=60" alt="Ivana">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Ivana Markovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@ivana_toronto &middot; Toronto</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Djeca mi prate RTL Kids i HRT i presretna su. Mu\u017e gleda utakmice. Ja doma\u0107e serije. Sve na jednom ra\u010dunu! Cijena je super za sve \u0161to dobijamo.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=60" alt="Nikola">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Nikola \u0110or\u0111evi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@nikola_stockholm &middot; Stockholm</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Koristim na Fire TV Stick \u2014 postavljanje je lako, sve radi iz prve. Nova liga prvaka sezona \u2014 gledao sam svaku utakmicu bez jednog prekida!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60" alt="Amira">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Amira Selimovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@amira_genf &middot; Genf</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Stariji roditelji koji ne znaju tehnologiju koristili su bez problema! Jednostavno kao kablovska TV. Hvala na odli\u010dnoj usluzi, nastavit \u0107emo koristiti.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

      <!-- DUPLICATE SET for seamless loop -->
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=60" alt="Dino">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Dino Mehi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@dino_chicago &middot; Chicago</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Live sport iz Evrope gledam ovde u Americi bez VPN-a! Fudbal, ko\u0161arka, rukomet \u2014 sve je tu. Odli\u010dna latencija i bez zaostajanja slike.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&auto=format&fit=crop&q=60" alt="Maja">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Maja Stojanovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@maja_brussels &middot; Bruxelles</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Gledam Pink, Happy i Prva TV kao da sam u Beogradu. Besplatni test me je odmah uvjerio \u2014 naru\u010dila sam godi\u0161nju pretplatu. Nikako se ne kajem!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=60" alt="Haris">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Haris Bajri\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@haris_sydney &middot; Sydney</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Iz Australije pratim Premijer ligu BiH u\u017eivo! Vremenska razlika je problem ali stream radi savr\u0161eno 24/7. Podr\u0161ka je odgovorila za 10 minuta.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=60" alt="Ivana">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Ivana Markovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@ivana_toronto &middot; Toronto</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Djeca mi prate RTL Kids i HRT i presretna su. Mu\u017e gleda utakmice. Ja doma\u0107e serije. Sve na jednom ra\u010dunu! Cijena je super za sve \u0161to dobijamo.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=60" alt="Nikola">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Nikola \u0110or\u0111evi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@nikola_stockholm &middot; Stockholm</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Koristim na Fire TV Stick \u2014 postavljanje je lako, sve radi iz prve. Nova liga prvaka sezona \u2014 gledao sam svaku utakmicu bez jednog prekida!</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>
      <div class="mx-3 p-5 rounded-2xl border border-stone-700 bg-stone-800 w-72 shrink-0 hover:border-purple-500 transition-colors duration-300">
        <div class="flex items-center gap-3 mb-4">
          <img class="w-11 h-11 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60" alt="Amira">
          <div>
            <div class="flex items-center gap-1">
              <p class="text-white font-semibold text-sm">Amira Selimovi\u0107</p>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 48 48"><polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884"/><polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926"/></svg>
            </div>
            <p class="text-gray-500 text-xs">@amira_genf &middot; Genf</p>
          </div>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed">Stariji roditelji koji ne znaju tehnologiju koristili su bez problema! Jednostavno kao kablovska TV. Hvala na odli\u010dnoj usluzi, nastavit \u0107emo koristiti.</p>
        <div class="mt-3 text-yellow-400 text-sm">\u2605\u2605\u2605\u2605\u2605</div>
      </div>

    </div>
    <div class="pointer-events-none absolute right-0 top-0 h-full w-28 z-10" style="background:linear-gradient(to left,#1c1917,transparent)"></div>
  </div>

</section>
<!-- ===== END TESTIMONIALS ===== -->
'''

content = open('dist/index.html', encoding='utf-8').read()

INSERT_BEFORE = '<astro-island uid="ZXPmSJ"'
if INSERT_BEFORE not in content:
    print("ERROR: marker not found!")
    exit(1)

new_content = content.replace(INSERT_BEFORE, TESTIMONIAL_SECTION + INSERT_BEFORE, 1)
open('dist/index.html', 'w', encoding='utf-8').write(new_content)
print("SUCCESS: testimonial marquee section inserted")
print(f"File grew by {len(new_content) - len(content)} chars")
