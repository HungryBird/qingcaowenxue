<template>
  <div>
    <div id="wx-article-body">
      <template v-if="imgUrl === ''">
        <section style="margin:15px 6px;border:1px solid #A5A5A5;overflow:hidden;box-sizing:border-box;padding:1em;">
          <section class="chapter">
            <section style="display: inline-block; text-align: center; padding: 0.1em 0.1em 0em; color: rgb(29, 92, 105); background: rgb(160, 217, 229);transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);">
              <section style="width: 90%; height: 1px; border-top-width: 0.3em; border-top-style: solid; border-color: rgb(80, 185, 207); margin-top: -0.2em; margin-left: -1px; transform: rotate(-3deg) !important;transform: rotate(-3deg);-webkit-transform: rotate(-3deg);-moz-transform: rotate(-3deg);-o-transform: rotate(-3deg);" />
              <section style="color:#fff;padding:0.5em 0.8em;">
                <p style="margin:0">
                  <span style="color: #FFFFFF;" class="chapter-title">
                    {{ title }}
                  </span>
                </p>
              </section>
            </section>
            <section style="width: auto; height: auto; margin: -1em auto 0; overflow: hidden; border-top-width: 0.1em; border-top-style: dashed; border-top-color: rgb(160, 217, 229); padding: 1em 0.2em 0; line-height: 1.4em;">
              <section style="padding:10px 0;line-height:1.8em;" class="chapter-content" />
            </section>
          </section>
        </section>
        <section style="margin:15px 6px;border:1px solid #A5A5A5;overflow:hidden;box-sizing:border-box;padding:1em;">
          <section class="chapter">
            <!-- <section style="display: inline-block; text-align: center; padding: 0.1em 0.1em 0em; color: rgb(29, 92, 105); background: rgb(160, 217, 229);transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);">
              <section style="width: 90%; height: 1px; border-top-width: 0.3em; border-top-style: solid; border-color: rgb(80, 185, 207); margin-top: -0.2em; margin-left: -1px; transform: rotate(-3deg) !important;transform: rotate(-3deg);-webkit-transform: rotate(-3deg);-moz-transform: rotate(-3deg);-o-transform: rotate(-3deg);" />
              <section style="color:#fff;padding:0.5em 0.8em;">
                <p style="margin:0">
                  <span style="color: #FFFFFF;" class="chapter-title">第1章：穿越了</span>
                </p>
              </section>
            </section> -->
            <section style="width: auto; height: auto; margin: -1em auto 0; overflow: hidden; border-top-width: 0.1em; border-top-style: dashed; border-top-color: rgb(160, 217, 229); padding: 1em 0.2em 0; line-height: 1.4em;">
              <section style="padding:10px 0;line-height:1.8em;" class="chapter-content" v-html="content" />
            </section>
          </section>
        </section>
      </template>
      <img v-if="imgUrl !== ''" :src="imgUrl">
    </div>
    <div id="wx-article-footer"><img style="max-width:100%" :src="chapterBottom"></div>
  </div>
</template>

<script>
import generateImg from '@/mixs/generateImg'

export default {
  name: 'Template2',
  mixins: [generateImg],
  props: {
    chapterBottom: {
      type: String,
      default: 'http://new.fuleien.com/uploads/copywriting/images/footer6.gif'
    }
  }
}
</script>
