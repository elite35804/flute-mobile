export function defineProperty(obj, key, getter, setter) {
  try {
    Object.defineProperty(obj, key, {
      enumerable: false,
      get: getter,
      set: setter,
    });
  } catch (ex) { ex; }
}

export function setupItems(items, setup) {
  if (!items) return items;
  if (!items.length) {
    setup(items);
  } else {
    items.forEach(setup);
  }

  return items;
}
