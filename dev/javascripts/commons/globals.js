window.App || (window.App = {});
window.App.config = {
  promises: {
    dustBluebird: Promise.promisifyAll(dust),
    cloudinaryBird: Promise.promisifyAll($.cloudinary)
  },
  commons: {
    map: {},
    trans: {}
  },
  cache: {
    activeEstate: {},
    activeEstateListing: {}
  },
  modules: {
    map: {},
    info: {},
    edit: {},
    delete: {},
    insert: {},
    filters: {}
  }
};
window.App.utils = {};
// var trans;
// var cloudinaryBird = Promise.promisifyAll($.cloudinary);
// var activeEstate;
// var activeEstateListing;
$.cloudinary.config({ cloud_name: 'firvain', api_key: '375138932689591' });
