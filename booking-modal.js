;(function () {
  // ─── CONFIGURATION ────────────────────────────────────────────────────────
  // 1. Go to https://formspree.io, create a free form, and paste the ID below.
  //    The form data will be emailed to whatever address you register with.
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xojzngwj'

  // 2. Calendly booking link — already correct for Claudia's calendar.
  var CALENDLY_URL = 'https://calendly.com/claudiabeck/30-min-check-in'
  // ──────────────────────────────────────────────────────────────────────────

  var TEMPLATE = [
    '<div id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-headline"',
    '  class="hidden fixed inset-0 z-[200] flex items-center justify-center p-4">',
    '  <div id="booking-modal-backdrop" class="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>',
    '  <div tabindex="-1" id="booking-modal-panel"',
    '    class="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-metallic-gold/30 shadow-2xl"',
    '    style="background:#0C1434">',
    '    <button id="booking-modal-close" aria-label="Close"',
    '      class="absolute top-4 right-4 text-stark-white/40 hover:text-metallic-gold text-2xl leading-none cursor-pointer z-10 transition-colors">&times;</button>',
    '    <div id="booking-modal-body" class="p-8 md:p-12"></div>',
    '  </div>',
    '</div>',
  ].join('')

  function inject () {
    if (document.getElementById('booking-modal')) return
    var wrapper = document.createElement('div')
    wrapper.innerHTML = TEMPLATE
    document.body.appendChild(wrapper.firstElementChild)
  }

  function openBookingModal () {
    var modal = document.getElementById('booking-modal')
    if (!modal) return
    var isAlreadyOpen = !modal.classList.contains('hidden')
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    if (!isAlreadyOpen) showStep1()
    var panel = modal.querySelector('[tabindex="-1"]')
    if (panel) panel.focus()
  }

  function closeModal () {
    var modal = document.getElementById('booking-modal')
    if (!modal) return
    modal.classList.add('hidden')
    document.body.style.overflow = ''
    modal.classList.add('items-center')
    modal.classList.remove('items-start', 'py-4')
    var panel = document.getElementById('booking-modal-panel')
    if (panel) {
      panel.classList.add('max-h-[90vh]', 'overflow-y-auto')
      panel.classList.remove('my-4', 'overflow-hidden')
    }
  }

  var FRICTION_OPTIONS = [
    'Alignment — we\'re not all moving in the same direction',
    'Trust — people aren\'t fully candid or committed',
    'Truth — the real issues don\'t surface in the room',
    'Understanding — leadership doesn\'t have a clear read on team dynamics',
    'Navigation — we react to crises instead of anticipating them',
    'Execution — decisions get made but don\'t actually stick',
  ]

  function showStep1 () {
    var checkboxes = FRICTION_OPTIONS.map(function (opt) {
      return [
        '<label class="flex items-start gap-3 cursor-pointer group">',
        '  <input type="checkbox" name="bm-friction" value="' + opt + '"',
        '    class="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer" style="accent-color:#F8E193" />',
        '  <span class="text-stark-white/60 font-body-md text-[15px] leading-relaxed group-hover:text-stark-white transition-colors">' + opt + '</span>',
        '</label>',
      ].join('')
    }).join('')

    document.getElementById('booking-modal-body').innerHTML = [
      '<h2 id="booking-modal-headline" class="font-display-lg text-[22px] text-stark-white mb-3 tracking-tight">Start the conversation.</h2>',
      '<p class="text-stark-white/50 font-body-md text-[15px] mb-8 leading-relaxed">Team performance work requires the right context. Two minutes — and we\'ll know if this is the right fit.</p>',
      '<form id="bm-form" novalidate class="space-y-6">',

      // Row 1: role + org
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">',
      '  <div>',
      '    <label class="block text-stark-white font-body-md font-semibold mb-1 text-[14px] tracking-wide" for="bm-role">',
      '      Your role <span style="color:#F8E193">*</span>',
      '    </label>',
      '    <input id="bm-role" type="text" placeholder="e.g. Chief People Officer"',
      '      class="w-full border border-metallic-gold/20 text-stark-white px-4 py-3 font-body-md text-[15px] focus:outline-none focus:border-metallic-gold/60 transition-colors placeholder:text-stark-white/25"',
      '      style="background:#060A1C" />',
      '  </div>',
      '  <div>',
      '    <label class="block text-stark-white font-body-md font-semibold mb-1 text-[14px] tracking-wide" for="bm-organization">Organization</label>',
      '    <input id="bm-organization" type="text" placeholder="Company or institution"',
      '      class="w-full border border-metallic-gold/20 text-stark-white px-4 py-3 font-body-md text-[15px] focus:outline-none focus:border-metallic-gold/60 transition-colors placeholder:text-stark-white/25"',
      '      style="background:#060A1C" />',
      '  </div>',
      '</div>',

      // Row 2: team challenge
      '<div>',
      '  <label class="block text-stark-white font-body-md font-semibold mb-2 text-[14px] tracking-wide" for="bm-challenge">',
      '    What\'s happening with your team — and what do you think is really behind it? <span style="color:#F8E193">*</span>',
      '  </label>',
      '  <textarea id="bm-challenge" rows="4" placeholder="Be direct."',
      '    class="w-full border border-metallic-gold/20 text-stark-white px-4 py-3 font-body-md text-[15px] focus:outline-none focus:border-metallic-gold/60 transition-colors resize-none placeholder:text-stark-white/25"',
      '    style="background:#060A1C"></textarea>',
      '</div>',

      // Row 3: ATTUNE friction checkboxes
      '<div>',
      '  <p class="text-stark-white font-body-md font-semibold mb-3 text-[14px] tracking-wide">',
      '    Where does the breakdown show up? <span class="text-stark-white/30 text-[13px] font-normal">(Select all that apply)</span>',
      '  </p>',
      '  <div class="space-y-2">',
      checkboxes,
      '  </div>',
      '</div>',

      // Submit
      '<button id="bm-submit" type="submit" disabled',
      '  class="w-full px-8 py-4 font-label-caps text-label-caps tracking-widest cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"',
      '  style="background:#F8E193;color:#0C1434">',
      '  Find a Time →',
      '</button>',

      '</form>',
    ].join('')

    bindStep1()
  }

  function checkStep1Validity () {
    var role = (document.getElementById('bm-role') ? document.getElementById('bm-role').value : '').trim()
    var challenge = (document.getElementById('bm-challenge') ? document.getElementById('bm-challenge').value : '').trim()
    var btn = document.getElementById('bm-submit')
    if (btn) btn.disabled = !(role && challenge)
  }

  function bindStep1 () {
    var roleEl = document.getElementById('bm-role')
    var challengeEl = document.getElementById('bm-challenge')
    if (roleEl) roleEl.addEventListener('input', checkStep1Validity)
    if (challengeEl) challengeEl.addEventListener('input', checkStep1Validity)
    var form = document.getElementById('bm-form')
    if (form) form.addEventListener('submit', handleStep1Submit)
  }

  function handleStep1Submit (e) {
    e.preventDefault()

    var payload = {
      role: document.getElementById('bm-role').value.trim(),
      organization: document.getElementById('bm-organization').value.trim(),
      teamChallenge: document.getElementById('bm-challenge').value.trim(),
      breakdownAreas: Array.from(document.querySelectorAll('[name="bm-friction"]:checked')).map(function (cb) { return cb.value }),
      source: window.location.pathname,
    }

    // Fire-and-forget — does not block transition to Step 2
    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(function () { /* silent — data capture is best-effort */ })

    showStep2()
  }

  function showStep2 () {
    var modal = document.getElementById('booking-modal')
    if (modal) {
      modal.classList.remove('items-center')
      modal.classList.add('items-start', 'py-4')
    }
    var panel = document.getElementById('booking-modal-panel')
    if (panel) {
      panel.classList.remove('my-4', 'overflow-y-auto')
      panel.classList.add('max-h-[90vh]', 'overflow-hidden')
    }

    document.getElementById('booking-modal-body').innerHTML = [
      '<p id="booking-modal-headline" class="text-stark-white/80 font-body-md text-[17px] mb-6 leading-relaxed" style="font-family:\'Source Serif 4\',serif">',
      'Thanks — that context matters. Let\'s find a time.',
      '</p>',
      '<div id="bm-calendly-container" style="min-width:320px;height:calc(90vh - 180px);min-height:500px;"></div>',
      '<div id="bm-post-booking" class="mt-6"></div>',
    ].join('')

    loadCalendly(CALENDLY_URL)
    listenForBookingConfirmed()
  }

  function showPostBooking () {
    var container = document.getElementById('bm-calendly-container')
    if (container) {
      container.style.height = '160px'
      container.style.minHeight = '0'
      container.style.overflow = 'hidden'
      container.style.opacity = '0.5'
      container.style.pointerEvents = 'none'
    }

    var postBooking = document.getElementById('bm-post-booking')
    if (postBooking) {
      postBooking.innerHTML = [
        '<div class="text-center">',
        '  <button type="button" onclick="document.getElementById(\'booking-modal-close\').click()"',
        '    class="px-10 py-4 font-label-caps text-label-caps tracking-widest cursor-pointer transition-all duration-200 hover:brightness-110"',
        '    style="background:#F8E193;color:#0C1434">',
        '    Close this window',
        '  </button>',
        '</div>',
      ].join('')
    }

    var panel = document.getElementById('booking-modal-panel')
    if (panel) panel.scrollTop = 0
  }

  function loadCalendly (url) {
    if (window.Calendly) {
      var container = document.getElementById('bm-calendly-container')
      if (!container) return
      window.Calendly.initInlineWidget({ url: url, parentElement: container })
      return
    }
    if (document.querySelector('script[src*="calendly"]')) return
    var script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.onload = function () {
      var container = document.getElementById('bm-calendly-container')
      if (!container) return
      window.Calendly.initInlineWidget({ url: url, parentElement: container })
    }
    document.head.appendChild(script)
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.appendChild(link)
  }

  function listenForBookingConfirmed () {
    function onMessage (e) {
      if (e.data && e.data.event === 'calendly.event_scheduled') {
        showPostBooking()
        window.removeEventListener('message', onMessage)
      }
    }
    window.addEventListener('message', onMessage)
  }

  function bindTriggers () {
    document.querySelectorAll('[data-booking-trigger]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault()
        openBookingModal()
      })
    })
  }

  function init () {
    inject()
    document.getElementById('booking-modal-close').addEventListener('click', closeModal)
    document.getElementById('booking-modal-backdrop').addEventListener('click', closeModal)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal()
    })
    bindTriggers()
  }

  if (typeof window !== 'undefined') {
    window.openBookingModal = openBookingModal
  }

  document.addEventListener('DOMContentLoaded', init)
})()
