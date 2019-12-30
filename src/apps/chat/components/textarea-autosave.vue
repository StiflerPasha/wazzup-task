<template>
  <b-input-group>
    <h6 class="label">
      <i v-if="style === 'success'" style="color: green" class="icon mdi mdi-check"/>
      <i v-if="style === 'danger'" style="color: red" class="icon mdi mdi-close"/>
      {{ label }}
      <span v-if="!isEdit" :class="{value: data, 'value-disable': !data}" @click="edit()">
        {{ data || placeholder }}
      </span>
    </h6>
    <b-form-textarea
      v-if="isEdit"
      v-model="editValue"
      ref="textarea_field"
      :readonly="pending"
      size="sm"
      autofocus
      @keyup.enter.native="saveValue()"
      @keyup.esc.native="closeEdit()"
      @blur.native="closeEdit()"
    />
  </b-input-group>
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
      placeholder: String,
      save: Function,
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
          this.$refs.textarea_field.focus()
        })
      },
      closeEdit () {
        this.isEdit = false
      },
      saveValue () {
        this.pending = true
        this.save(this.editValue.trim()).then(() => {
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
    display: block;
  }

  .value {
    color: black;
  }

  .value-disable {
    color: gray;
  }
</style>
