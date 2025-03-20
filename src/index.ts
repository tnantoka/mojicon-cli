export const main = () => {
  console.log('Hello World');
};

// istanbul ignore next
if (module === require.main) {
  main();
}
