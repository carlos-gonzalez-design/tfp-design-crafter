<script setup>
import { NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuRoot, NavigationMenuTrigger, NavigationMenuViewport } from 'reka-ui'

defineProps({ items: { type: Array, required: true }, label: { type: String, default: 'Primary' } })
</script>

<template>
  <NavigationMenuRoot class="ds-navigation-menu" :aria-label="label" data-ds-component="DsNavigationMenu">
    <NavigationMenuList class="ds-navigation-menu__list">
      <NavigationMenuItem v-for="item in items" :key="item.label" class="ds-navigation-menu__item">
        <NavigationMenuTrigger v-if="item.children" class="ds-navigation-menu__trigger">{{ item.label }} <span aria-hidden="true">⌄</span></NavigationMenuTrigger>
        <NavigationMenuLink v-else class="ds-navigation-menu__link" :href="item.href || '#'">{{ item.label }}</NavigationMenuLink>
        <NavigationMenuContent v-if="item.children" class="ds-navigation-menu__content">
          <NavigationMenuLink v-for="child in item.children" :key="child.label" class="ds-navigation-menu__card" :href="child.href || '#'">
            <strong>{{ child.label }}</strong><span>{{ child.description }}</span>
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuViewport class="ds-navigation-menu__viewport" />
  </NavigationMenuRoot>
</template>
