<script>
  import InputNumber from 'iview/src/components/input-number'
  // import InputNumber from 'iview/src'

  export default {
    extends: InputNumber,
    computed: {
      precisionValue () {
        return parseInt(this.currentValue, 10);
      }
    },
    methods: {
      change (event) {
        let val = event.target.value.trim();

        // if (event.type == 'input' && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later

        const {min, max} = this;
        const isEmptyString = val.length === 0;
        val = parseInt(Number(val), 10);
        event.target.value = val;

        if (event.type == 'change'){
          if (val === this.currentValue && val > min && val < max) return; // already fired change for input event
        }

        if (!isNaN(val) && !isEmptyString) {
          this.currentValue = val;

          if (event.type == 'input' && val < min) return; // prevent fire early in case user is typing a bigger number. Change will handle this otherwise.
          if (val > max) {
            this.setValue(max);
          } else if (val < min) {
            this.setValue(min);
          } else {
            this.setValue(val);
          }
        } else {
          event.target.value = this.currentValue;
        }
      },
    }
  }
</script>
