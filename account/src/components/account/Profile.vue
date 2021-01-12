<template>
    <div>
        <nav class="container py-3 d-block d-md-none">
            <router-link tag="span"
                         class="breadcrumb-item text-size-12"
                         :to="{name: 'basicInfo'}"
            >
                {{$t('accountNavigation.basicInfo')}}
            </router-link>
            <router-link tag="span"
                         class="breadcrumb-item text-size-12"
                         :to="{name: 'contactInfo'}"
            >
                {{$t('accountNavigation.contactInfo')}}
            </router-link>
            <router-link tag="span"
                         class="breadcrumb-item text-size-12"
                         :to="{name: 'passwordChange'}"
            >
                {{$t('accountNavigation.passwordChange')}}
            </router-link>
        </nav>
        <div class="container mb-5 pb-5">
            <router-view @profileRefresh="$emit('profileRefresh')"/>
        </div>
    </div>
</template>
