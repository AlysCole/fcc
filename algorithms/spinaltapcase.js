function spinalCase(str) {
  return str.replace(/[\ _]|([^\ ])([A-Z])/g, "$1-$2").toLowerCase();
}

spinalCase('This Is Spinal Tap');
spinalCase('thisIsSpinalTap');
spinalCase('The_Andy_Griffith_Show');
spinalCase('Teletubbies say Eh-oh');
