<template>
  <b-container fluid>
    <b-row align-v="center">
      <b-col v-if="label" sm="3" style="padding: 0;">
        <h6 class="label">
          <i v-if="style === 'success'" style="color: green" class="icon mdi mdi-check"/>
          <i v-if="style === 'danger'" style="color: red" class="icon mdi mdi-close"/>
          {{ label }}
        </h6>
      </b-col>
      <b-col :sm="label ? '9' : '12'" style="padding: 0;">
        <h6 v-if="!isEdit" class="label">
          <i v-if="style === 'success' && !label" style="color: green" class="icon mdi mdi-check"/>
          <i v-if="style === 'danger' && !label" style="color: red" class="icon mdi mdi-close"/>
          <span :class="{value: data, 'value-disable': !data}" @click="edit()">
            {{ data || placeholder }}
          </span>
        </h6>
        <b-form-input
          v-else
          v-model="editValue"
          ref="input_field"
          :readonly="pending"
          size="sm"
          autofocus
          @keyup.enter.native="saveValue()"
          @keyup.esc.native="closeEdit()"
          @blur.native="closeEdit()"
        />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  export default {
    data: () => ({
      isEdit: false,
      editValue: '',
      style: '',
      pending: false
    }),
    props: {
      label: String,
      data: String,
      save: Function,
      placeholder: String,
      statusTimeout: {
        type: Number,
        default: 1500
      }
    },
    methods: {
      edit () {
        this.editValue = this.data
        this.isEdit = true
        this.$nextTick(() => {
          this.$refs.input_field.focus()
        })
      },
      closeEdit () {
        this.isEdit = false
      },
      saveValue () {
        this.pending = true
        this.save(this.editValue).then(() => {
          this.style = 'success'
          setTimeout(() => {
            this.style = ''
          }, this.statusTimeout)
          this.pending = false
          this.isEdit = false
        }).catch((e) => {
          this.style = 'danger'
          setTimeout(() => {
            this.style = ''
          }, this.statusTimeout)
          this.pending = false
          this.isEdit = false
        })
      }
    }
  }
</script>

<style>
  .label {
    color: gray;
    margin: 0;
  }

  .value {
    color: black;
  }

  .value:hover {
    border: 1px solid gray;
  }
</style>
