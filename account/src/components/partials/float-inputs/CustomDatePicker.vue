<template>
    <div class="floating-label-datepicker"
         :class="[{'chosen': notNull}, customClass]">
        <label>
            {{label}}
        </label>
        <div class="row content">
            <div class="p-0 m-0"
                 :class="[{'col-3': notNull}, {'col': !notNull}]"
            >
                <select class="form-control border-0 bg-transparent"
                        :value="value.year"
                        style="border-radius: 4px 0.1px 0.1px 4px;"
                        @input="changeDate('year', $event.target.value)"
                >
                    <option value="">
                        {{$t('year')}}
                    </option>
                    <option  v-for="(option, index) in birthYears"
                             :value="option.value"
                             :key="index"
                    >
                        {{option.name}}
                    </option>
                </select>
            </div>
            <div v-if="notNull" class="col p-0 m-0">
                <select class="form-control border-0 bg-transparent"
                        :value="value.month"
                        style="border-radius: 0.1px;"
                        @input="changeDate('month', $event.target.value)"
                >
                    <option selected :value="null">
                        {{$t('month')}}
                    </option>
                    <option  v-for="(option, index) in birthMonths"
                             :value="option.value"
                             :key="index"
                    >
                        {{option.name}}
                    </option>
                </select>
            </div>
            <div v-if="notNull" class="col p-0 m-0">
                <select class="form-control border-0 bg-transparent"
                        :value="value.day"
                        style="border-radius: 0.1px 4px 4px 0.1px"
                        @input="changeDate('day', $event.target.value)"
                >
                    <option selected :value="null">
                        {{$t('day')}}
                    </option>
                    <option  v-for="(option, index) in birthDays"
                             :value="option.value"
                             :key="index"
                    >
                        {{option.name}}
                    </option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    value: [String, Number, Object],
    type: String,
    placeholder: String,
    name: String,
    label: String,
    id: String,
    inputMode: String,
    pattern: String,
    customClass: String,
    options: Array,
  },
  data() {
    return {
      date: {
        year: null,
        month: null,
        day: null,
      },
    };
  },
  created() {
    this.date = {
      year: this.value.year,
      month: this.value.month,
      day: this.value.day,
    };
  },
  watch: {
    value() {
      this.date = {
        year: this.value.year,
        month: this.value.month,
        day: this.value.day,
      };
    },
  },
  methods: {
    changeDate(key, value) {
      this.date[key] = value;
      this.$emit('input', this.date);
    },
  },
  computed: {
    notNull() {
      let notNull = false;
      if (this.value.year || this.value.month || this.value.day) {
        notNull = true;
      }
      return notNull;
    },
    birthYears() {
      const yearNow = Number(new Date().getFullYear());
      const oldestUserYear = 120;
      const years = [];
      for (let i = yearNow; i > yearNow - oldestUserYear; i -= 1) {
        years.push({
          name: i,
          value: i,
        });
      }
      return years;
    },
    birthMonths() {
      const months = [];
      for (let i = 1; i <= 12; i += 1) {
        months.push({
          name: this.$t(`months.${i}`),
          value: i,
        });
      }
      return months;
    },
    birthDays() {
      const days = [];
      for (let i = 1; i <= 31; i += 1) {
        days.push({
          name: i,
          value: i,
        });
      }
      return days;
    },
  },
};
</script>
