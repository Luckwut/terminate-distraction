export default defineContentScript({
  matches: ['<all_urls>'],
  main(ctx) {
    document.body.innerHTML = '<h1>I know what you are</h1>';
    console.log('Hello content.');
  },
});
