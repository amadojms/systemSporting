Introduction
Uso
API
Ejemplos
Diamond Sponsors

Explore millions of stunning images, with thousands more added every day. Plans start at just $29.
ADS VIA CARBON

Vuetify
Premiere sponsor
One spot available

Search
Core documentation
Getting started
Framework Options
Application layout
Styles & themes
Motion & transitions
UI components
Groups
Inputs & controls
Pickers
Directives
Additional resources
Advanced tutorials
Divider

El componente v-divider se usa para separar secciones de las listas.

Uso

Los dividers de sangrado completo se extienden a todo el ancho del contenido.

Inbox
API

v-divider

Search...
Nombre
dark
Default
false
Type
boolean
Aplica la variante del tema dark

Nombre
inset
Default
false
Type
boolean
Agrega indentación (72px) para los dividers normales, reduce la altura máxima en el caso de los verticales

Nombre
light
Default
false
Type
boolean
Aplica la variante del tema light

New in — v1.1
Nombre
vertical
Default
false
Type
boolean
Crea un divider vertical

Ejemplos

Claro y oscuro
Los Dividers tienen variantes light y dark.

Manage
Labels
Inset dividers
Los inset dividers se mueven 72px hacia la derecha arriba. Esto causará que se alineen con los items de la lista..

Inbox
Today
_Subheaders_ y _dividers_
Los subheaders pueden alinearse con los inset dividers usando la misma prop..

My files
Folders
Files
_List dividers_
Los inset dividers y los subheaders pueden ayudar a separar el contenido.

Message Board
Today
Yesterday
Last Week
_Dividers_ en modo _Portrait_
Crea cards personalizadas para que se ajusten a cualquier caso de uso

Sarah Mcbeal
_Dividers_ en modo vertical
New in
 
v1.1
Los dividers verticales te dan aun más herramientas para layouts únicos.

<template>
  <v-toolbar
    color="purple"
    dark
  >
    <v-toolbar-title>Title</v-toolbar-title>

    <v-divider
      class="mx-3"
      inset
      vertical
    ></v-divider>

    <span class="subheading">My Home</span>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn flat>
        News
      </v-btn>

      <v-divider vertical></v-divider>

      <v-btn flat>
        Blog
      </v-btn>

      <v-divider vertical></v-divider>

      <v-btn flat>
        Music
      </v-btn>

      <v-divider vertical></v-divider>
    </v-toolbar-items>

    <v-toolbar-side-icon></v-toolbar-side-icon>
  </v-toolbar>
</template>
content_copy
Title
My Home
Dialogs
Expansion panels