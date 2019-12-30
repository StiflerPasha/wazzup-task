import Channels from 'settings_views/Channels'
import Finance from 'settings_views/Finance'
import Integrations from 'settings_views/Integrations'
import Affiliate from 'settings_views/Affiliate'
import SettingsUsers from 'settings_views/SettingsUsers'
import Page404 from 'settings_views/404.vue'
import SettingsBookmarks from 'settings_views/SettingsBookmarks.vue'

export default [
  {
    path: '',
    name: 'settings-main',
    component: {
      render: () => ({}),
      beforeCreate () {
        this.$router.push({
          name: 'settings-channels',
          params: {
            app: 'settings',
            type: 'channels'
          }
        })
      }
    }
  },
  {
    path: ':type(affiliate)',
    name: 'settings-affiliate',
    component: Affiliate
  },
  {
    path: ':type(channels)',
    name: 'settings-channels',
    component: Channels
  },
  {
    path: ':type(integrations)',
    name: 'settings-integrations',
    component: Integrations
  },
  {
    path: ':type(finance)',
    name: 'settings-finance',
    component: Finance
  },
  {
    path: ':type(users)',
    name: 'settings-users',
    component: SettingsUsers
  },
  {
    path: ':type(bookmarks)',
    name: 'settings-bookmarks',
    component: SettingsBookmarks
  },
  {
    path: '/settings/*',
    name: 'settings-404',
    component: Page404
  }
]
