/* The Legal Fennec: consent-gated Google Analytics 4. No analytics requests before opt-in. */
(function () {
  'use strict';
  var ID = 'G-PJPEL33JVQ';
  var KEY = 'tlf-analytics-consent-v1';
  var analyticsLoaded = false;
  var banner, dialog;
  function stored() { try { return localStorage.getItem(KEY); } catch (_) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (_) {} }
  function clearAnalyticsCookies() {
    /* Best-effort removal from this site; cannot undo already transmitted events. */
    var variants = [location.hostname, '.' + location.hostname, '.thelegalfennec.org', 'thelegalfennec.org'];
    document.cookie.split(';').forEach(function(c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax';
        variants.forEach(function(domain) {
          document.cookie = name + '=; Max-Age=0; path=/; domain=' + domain + '; SameSite=Lax';
        });
      }
    });
  }
  function startAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments);};
    window.gtag('js', new Date());
    window.gtag('config', ID, { anonymize_ip: true });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.appendChild(script);
  }
  function setConsent(v) {
    save(v);
    if (banner) banner.hidden = true;
    if (dialog) dialog.hidden = true;
    if (v === 'accepted') startAnalytics();
    else {
      clearAnalyticsCookies();
      /* If analytics already loaded, prevent further collection this visit. */
      window['ga-disable-' + ID] = true;
      if (analyticsLoaded) location.reload();
    }
  }
  function elem(tag, attrs, txt) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function(k) { if (k === 'class') e.className=attrs[k]; else e.setAttribute(k,attrs[k]); });
    if (txt) e.textContent = txt;
    return e;
  }
  function button(text, cls, fn) {
    var b=elem('button', {type:'button','class':cls},text);b.addEventListener('click',fn);return b;
  }
  function init() {
    var css=elem('link',{rel:'stylesheet',href:(location.pathname.includes('/articles/')?'../':'')+'privacy-consent.css'});
    document.head.appendChild(css);
    var privacyPath=(location.pathname.includes('/articles/')?'../':'')+'privacy.html';
    banner=elem('section',{'class':'tlf-consent','role':'region','aria-label':'Analytics preferences'});
    banner.appendChild(elem('h2',{},'Your privacy matters'));
    var p=elem('p',{},'We use optional Google Analytics to understand visits and improve this independent publication. Analytics stays off unless you accept. You can change your choice at any time. ');
    var a=elem('a',{href:privacyPath},'Privacy information');p.appendChild(a);banner.appendChild(p);
    var buttons=elem('div',{'class':'tlf-consent-actions'});
    buttons.appendChild(button('Reject analytics','tlf-btn-outline',function(){setConsent('rejected');}));
    buttons.appendChild(button('Accept analytics','tlf-btn-solid',function(){setConsent('accepted');}));
    banner.appendChild(buttons);document.body.appendChild(banner);
    dialog=elem('section',{'class':'tlf-preferences','role':'dialog','aria-modal':'true','aria-label':'Privacy settings'});
    dialog.hidden=true;
    dialog.appendChild(elem('h2',{},'Privacy settings'));
    dialog.appendChild(elem('p',{},'Essential website features stay active. Google Analytics is optional and only starts if you select “Accept analytics”.'));
    var actions=elem('div',{'class':'tlf-consent-actions'});
    actions.appendChild(button('Reject analytics','tlf-btn-outline',function(){setConsent('rejected');}));
    actions.appendChild(button('Accept analytics','tlf-btn-solid',function(){setConsent('accepted');}));
    dialog.appendChild(actions);
    dialog.appendChild(button('Close','tlf-btn-text',function(){dialog.hidden=true;}));
    document.body.appendChild(dialog);
    var footer=elem('div',{'class':'tlf-privacy-footer'});
    footer.appendChild(elem('a',{href:privacyPath},'Privacy information'));
    footer.appendChild(elem('span',{},' · '));
    footer.appendChild(button('Privacy settings','tlf-privacy-link',function(){dialog.hidden=false;}));
    document.body.appendChild(footer);
    var existing=stored();
    banner.hidden=(existing==='accepted'||existing==='rejected');
    if(existing==='accepted') startAnalytics();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
