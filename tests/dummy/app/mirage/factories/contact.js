import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  code: function(i) {
    return 'C' + i;
  },
  name: faker.name.firstName
});
