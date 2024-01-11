export function listEquals(list1, list2) {
  if (list1.length !== list2.length) {
    return false;
  }
  return list1.every((item) => list2.includes(item));
}
