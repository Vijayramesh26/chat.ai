<template>


    <!-- common snackbar -->

    <v-snackbar :color="$globalData.backgroundColor" outlined rounded="pill" v-model="$globalData.snackbar"
        :timeout="$globalData.timeout">
        <v-row>
            <v-col>
                <v-icon medium :color="$globalData.IconColor">{{
                    $globalData.Icon
                    }}</v-icon>
                <span class="black--text body-2 pl-2">{{
                    $globalData.alerttitle
                    }}</span>
            </v-col>
        </v-row>
    </v-snackbar>
    <!-- common snackbar -->
</template>