export default function (name) {
  const names = name.split("_");
  const letter = names[1].charAt(0).toUpperCase();
  names[1] = letter + names[1].slice(1);
  return names.join("");
}
