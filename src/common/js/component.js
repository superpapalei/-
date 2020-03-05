import Vue from 'vue';
import { Form } from 'element-ui';

Vue.component('zj-form', {
    mixins: [Form],
    props: {
        newDataFlag: {
            type: Boolean,
            default: false
        },
    },
    watch: {
        newDataFlag: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.comparativeData = JSON.parse(JSON.stringify(this.model));
                }
            }
        },
        model: {
            deep: true,
            immediate: true,
            handler(val) {
                this.getUpdateColumns();
            }
        }
    },
    data() {
        return {
            comparativeData: [],
            UpdateColumns: [],
        }
    },
    methods: {
        getUpdateColumns() {
            this.UpdateColumns = [];
            Object.keys(this.comparativeData).forEach(key => {
                if (key == 'children') return;
                if (this.model[key] != this.comparativeData[key]) {
                    this.UpdateColumns.push(key);
                }
            });
            return this.UpdateColumns;
        }
    }
})