<template lang="html">
  <b-modal id="confirmModal" :title="title">
    {{ message }}
    <div slot="modal-footer" class="w-100">
      <b-btn
       class="float-right ml-3"
       variant="danger"
       @click="onConfirm"
     >
        {{ $t(`common.remove`)}}
      </b-btn>

       <b-btn
        class="float-right"
        variant="outline-primary"
        @click="onConfirm"
      >
         {{ $t(`common.cancel`)}}
       </b-btn>
     </div>
 </b-modal>
</template>

<script>
  export default {
    name: 'ConfirmModal',
    props: {
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      }
    },
    methods: {
      onConfirm () {
        this.$emit('confirm')
        this.$root.$emit('bv::hide::modal', 'confirmModal')
      },
      onCancel () {
        this.$emit('cancel')
        this.$root.$emit('bv::hide::modal', 'confirmModal')
      }
    }
  }
</script>
