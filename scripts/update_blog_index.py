import sys
sys.stdout.reconfigure(encoding='utf-8')

new_cards = (
    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/bosna-sp-2026-gledanje-iz-europe.webp" alt="Bosna na SP 2026 gledanje iz Europe" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Sport</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 8 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/bosna-sp-2026-gledanje-iz-europe/">Bosna na SP 2026: Kako pratiti utakmice iz Europe bez propu&#353;tanja</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Prakti&#269;an vodi&#269; za Bosansku dijasporu u Europi kako pratiti Bosnu i Hercegovinu na Svjetskom Prvenstvi 2026 u SAD-u uz pravi IPTV setup.</p>'
    '<a href="/blog/bosna-sp-2026-gledanje-iz-europe/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-green-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/hrvatska-srbija-sp-2026-exyu-diaspora.webp" alt="Hrvatska i Srbija na SP 2026" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Sport</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 7 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/hrvatska-srbija-sp-2026-exyu-diaspora/">Hrvatska i Srbija na SP 2026: Kako dijaspora prati sve EX-YU reprezentacije</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Sve EX-YU reprezentacije na SP 2026 u SAD-u. Vodi&#269; za dijasporu kako pratiti svaku utakmicu bez propu&#353;tanja iz Europe i Australije.</p>'
    '<a href="/blog/hrvatska-srbija-sp-2026-exyu-diaspora/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-700 to-red-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/ex-yu-iptv-velika-britanija-2026-balkanski-kanali.webp" alt="EX-YU IPTV Velika Britanija 2026" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Dijaspora</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 7 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/ex-yu-iptv-velika-britanija-2026-balkanski-kanali/">EX-YU IPTV Velika Britanija 2026: Balkanski kanali za dijasporu u UK</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Kompletni vodi&#269; za EX-YU dijasporu u UK. Gledajte bosanske, srpske i hrvatske kanale putem IPTV-a bez ograni&#269;enja u Londonu i ostatku Britanije.</p>'
    '<a href="/blog/ex-yu-iptv-velika-britanija-2026-balkanski-kanali/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-cyan-600 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/google-tv-chromecast-iptv-balkanski-kanali-2026.webp" alt="Google TV i Chromecast za IPTV" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Instalacija</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 6 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/google-tv-chromecast-iptv-balkanski-kanali-2026/">Google TV i Chromecast za EX-YU IPTV: Setup balkanski kanali na modernim ure&#273;ajima</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Kako podesiti EX-YU IPTV na Google TV i Chromecast ure&#273;ajima. Korak po korak vodi&#269; za balkanske kanale na Chromecast with Google TV.</p>'
    '<a href="/blog/google-tv-chromecast-iptv-balkanski-kanali-2026/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-700 to-orange-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/vpn-i-iptv-exyu-kanali-da-li-treba.webp" alt="VPN i IPTV dijaspora" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Savjeti</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 6 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/vpn-i-iptv-exyu-kanali-da-li-treba/">VPN i IPTV: Da li vam treba VPN za gledanje EX-YU kanala u inostranstvu</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Sve &#353;to trebate znati o VPN-u i IPTV kombinaciji. Da li je VPN potreban, kada poma&#382;e i kada odma&#382;e streaming kvalitetu za dijasporu.</p>'
    '<a href="/blog/vpn-i-iptv-exyu-kanali-da-li-treba/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-teal-600 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/djecji-exyu-program-iptv-dijaspora-setup.webp" alt="Djecji EX-YU program IPTV" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Savjeti</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 5 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/djecji-exyu-program-iptv-dijaspora-setup/">Dje&#269;ji EX-YU program na IPTV: Kako podesiti sadr&#382;aj za djecu dijaspore</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Vodi&#269; za roditelje u dijaspori: kako podesiti dje&#269;je EX-YU kanale i balkanski sadr&#382;aj za djecu odraslu u inostranstvu.</p>'
    '<a href="/blog/djecji-exyu-program-iptv-dijaspora-setup/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-700 to-violet-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/internet-brzina-iptv-hd-4k-streaming-koliko-mbps.webp" alt="Internet brzina za IPTV 4K" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Savjeti</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 6 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/internet-brzina-iptv-hd-4k-streaming-koliko-mbps/">Koliko Mbps treba za IPTV: Internet brzina za HD i 4K streaming u praksi</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Sve o internet brzini za IPTV streaming. Koliko Mbps treba za HD, Full HD i 4K IPTV kanale i kako provjeriti internet kapacitet.</p>'
    '<a href="/blog/internet-brzina-iptv-hd-4k-streaming-koliko-mbps/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-orange-500 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora.webp" alt="EX-YU IPTV Holandija i Belgija" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Dijaspora</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 7 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora/">EX-YU IPTV Holandija i Belgija: Balkanski kanali za dijasporu u Beneluks</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Vodi&#269; za EX-YU dijasporu u Holandiji i Belgiji. Gledajte balkanske kanale putem IPTV-a u Amsterdamu, Rotterdamu i Bruxellesu bez komplikacija.</p>'
    '<a href="/blog/ex-yu-iptv-holandija-belgija-beneluks-dijaspora/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-emerald-600 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/iptv-racunar-laptop-exyu-kanali-windows-mac.webp" alt="IPTV na racunaru i laptopu" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Instalacija</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 6 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/iptv-racunar-laptop-exyu-kanali-windows-mac/">IPTV na ra&#269;unaru i laptopu: Kako gledati EX-YU kanale na Windows i Mac</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Kako gledati EX-YU IPTV kanale direktno na ra&#269;unaru ili laptopu. Vodi&#269; za Windows i Mac korisnike s najboljim IPTV player opcijama.</p>'
    '<a href="/blog/iptv-racunar-laptop-exyu-kanali-windows-mac/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'

    '<article class="group bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">'
    '<div class="h-48 bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden relative flex items-center justify-center">'
    '<img src="/images/blog/iptv-za-roditelje-starije-dijaspora-vodic.webp" alt="IPTV za roditelje i starije" loading="lazy" width="480" height="192" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></div>'
    '<div class="p-6"><div class="flex items-center gap-3 mb-3"><span class="px-3 py-1 bg-blue-900/60 text-blue-300 text-xs font-semibold rounded-full">Savjeti</span>'
    '<time datetime="2026-04-18" class="text-gray-500 text-sm">18.4.2026</time><span class="text-gray-600 text-sm">&middot; 6 min</span></div>'
    '<h2 class="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2"><a href="/blog/iptv-za-roditelje-starije-dijaspora-vodic/">Kako podesiti IPTV za roditelje i starije: Jednostavan vodi&#269; za dijasporu</a></h2>'
    '<p class="text-gray-400 text-sm mb-4 line-clamp-3">Korak po korak vodi&#269; kako pomo&#263;i roditeljima i baki da gledaju doma&#263;e kanale putem IPTV-a. Setup za starije koji nisu tehni&#269;ki vje&#353;ti.</p>'
    '<a href="/blog/iptv-za-roditelje-starije-dijaspora-vodic/" class="inline-flex items-center gap-1 text-blue-400 font-semibold hover:gap-2 transition-all text-sm">Pro&#269;itaj vi&#353;e &rarr;</a></div></article>'
)

content = open('C:/Dev/github/exyuiptv.app_new/dist/blog/index.html', encoding='utf-8').read()

# Find insertion point: right before the closing of the articles grid
# The last </article> before </div> </div> </div>  </main>
marker = '</article></div> </div> </div>  </main>'
if marker in content:
    content = content.replace(marker, '</article>' + new_cards + '</div> </div> </div>  </main>')
    with open('C:/Dev/github/exyuiptv.app_new/dist/blog/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Blog index updated successfully')
else:
    print('ERROR: marker not found')
    # Try to find what the actual ending looks like
    idx = content.rfind('</article>')
    print('Last </article> context:', repr(content[idx:idx+100]))
