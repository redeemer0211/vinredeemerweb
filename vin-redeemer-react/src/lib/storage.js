export function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function loadValue(key, fallback = "") {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
