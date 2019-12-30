<template>
  <div>
    <b-row>
      <b-col>
        <b-card :title="$t(`__old__.users`)">
          <br>
          <b-tabs>
            <b-tab title="Users" active>
              <settings-users-table
                :users="users"
                class="mt-4 mb-4"
                @update="onUpdate"
              />
            </b-tab>
            <!-- <b-tab title="Groups">
            </b-tab>
            <b-tab title="Salary">
            </b-tab>
            <b-tab title="Logs">
            </b-tab> -->

          </b-tabs>

        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import SettingsUsersTable from '../components/SettingsUsers/SettingsUsersTable'

  const NAMESPACE = 'backend'
  export default {
    name: 'SettingsUsers',
    components: { SettingsUsersTable },
    computed: {
      ...mapState(NAMESPACE, ['users'])
    },
    created () {
      this.getUsers()
    },
    methods: {
      ...mapActions(NAMESPACE, ['getUsers']),
      onUpdate () {
        this.getUsers()
      }
    }
  }
</script>
