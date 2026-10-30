// Impedisce che il sito venga mostrato dentro pagine altrui (clickjacking).
if (window.top !== window.self) {
  try { window.top.location.replace(window.location.href); }
  catch (e) { document.documentElement.hidden = true; }
}
