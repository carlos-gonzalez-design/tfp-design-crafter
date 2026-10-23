<script setup>
import { ref } from 'vue'
import { Search } from '@lucide/vue'
import DsButton from '../design-system/actions/DsButton.vue'
import DsCheckbox from '../design-system/forms/DsCheckbox.vue'
import DsField from '../design-system/forms/DsField.vue'
import DsInput from '../design-system/forms/DsInput.vue'
import DsRadioGroup from '../design-system/forms/DsRadioGroup.vue'
import DsSelect from '../design-system/forms/DsSelect.vue'
import DsSlider from '../design-system/forms/DsSlider.vue'
import DsSwitch from '../design-system/forms/DsSwitch.vue'
import DsTextarea from '../design-system/forms/DsTextarea.vue'
import PlaygroundSectionHeader from './PlaygroundSectionHeader.vue'

const name = ref('Alex Morgan')
const email = ref('alex@example.com')
const password = ref('')
const search = ref('')
const bio = ref('')
const role = ref('designer')
const updates = ref(true)
const visibility = ref('team')
const publicProfile = ref(true)
const intensity = ref([64])
const announcement = ref('')

const roleOptions = [
  { value: 'designer', label: 'Product Designer' },
  { value: 'developer', label: 'Frontend Developer' },
  { value: 'lead', label: 'Design Lead' },
]

const visibilityOptions = [
  { value: 'private', label: 'Only me' },
  { value: 'team', label: 'My team' },
  { value: 'public', label: 'Everyone' },
]

function saveProfile() {
  announcement.value = `Profile saved for ${name.value || 'unnamed collaborator'}`
}

function resetForm() {
  name.value = 'Alex Morgan'
  email.value = 'alex@example.com'
  password.value = ''
  search.value = ''
  bio.value = ''
  role.value = 'designer'
  updates.value = true
  visibility.value = 'team'
  publicProfile.value = true
  intensity.value = [64]
  announcement.value = 'Profile changes reset'
}
</script>

<template>
  <section class="ds-playground-section" aria-labelledby="playground-forms-title">
    <PlaygroundSectionHeader
      title-id="playground-forms-title"
      title="Forms"
      description="A complete profile flow brings fields, validation and preferences into one calm, readable composition."
    />
    <form class="ds-form-demo" @submit.prevent="saveProfile">
      <header class="ds-form-demo__context">
        <div>
          <span class="ds-examples__label">Profile settings</span>
          <h4>Tell your team who you are.</h4>
        </div>
        <p>Fields stay familiar across default, supporting, search and error states.</p>
      </header>
      <div class="ds-form-demo__fields">
        <div class="ds-form-demo__field-row">
          <DsField id="form-name" label="Full name" description="Use the name shown to collaborators." required v-slot="{ describedby }">
            <DsInput id="form-name" v-model="name" :describedby="describedby" />
          </DsField>
          <DsField id="form-email" label="Email address" v-slot="{ describedby }">
            <DsInput id="form-email" v-model="email" type="email" :describedby="describedby" />
          </DsField>
        </div>
        <div class="ds-form-demo__field-row">
          <DsField id="form-password" label="Password" error="At least eight characters" v-slot="{ describedby }">
            <DsInput id="form-password" v-model="password" type="password" placeholder="Enter password" invalid :describedby="describedby" />
          </DsField>
          <DsField id="form-search" label="Search" v-slot="{ describedby }">
            <DsInput id="form-search" v-model="search" type="search" placeholder="Search projects" :describedby="describedby"><template #icon><Search :size="18" aria-hidden="true" /></template></DsInput>
          </DsField>
        </div>
        <div class="ds-form-demo__field-row">
          <DsField id="form-role" label="Role">
            <DsSelect id="form-role" v-model="role" :options="roleOptions" label="Role" />
          </DsField>
          <DsField id="form-error" label="Workspace URL" error="This URL is already in use." v-slot="{ describedby }">
            <DsInput id="form-error" model-value="design-team" invalid :describedby="describedby" />
          </DsField>
        </div>
        <div class="ds-form-demo__field-row ds-form-demo__field-row--single">
          <DsField id="form-bio" label="Bio" v-slot="{ describedby }">
            <DsTextarea id="form-bio" v-model="bio" placeholder="Tell your team what you are working on…" :describedby="describedby" />
          </DsField>
        </div>
      </div>
      <section class="ds-form-demo__choices" aria-label="Profile preferences">
        <div class="ds-form-demo__choice-group">
          <span class="ds-examples__label">Preferences</span>
          <DsCheckbox v-model="updates" label="Product updates" />
          <DsSwitch v-model="publicProfile" label="Public profile" />
        </div>
        <div class="ds-form-demo__choice-group">
          <span class="ds-examples__label">Visibility</span>
          <DsRadioGroup v-model="visibility" :options="visibilityOptions" label="Project visibility" />
        </div>
        <div class="ds-form-demo__choice-group ds-form-demo__choice-group--slider">
          <DsSlider v-model="intensity" label="Notification intensity" />
        </div>
      </section>
      <footer class="ds-form-demo__actions"><DsButton type="submit">Save profile</DsButton><DsButton variant="ghost" @click="resetForm">Cancel</DsButton></footer>
      <p class="sr-only" role="status" aria-live="polite">{{ announcement }}</p>
    </form>
  </section>
</template>
