<template lang="html">
    <div class="text-wrapper">
      <div class="account" v-show="page === '1'">
        <div class="account-wrapper" v-show="language === 'en'">
            <h3>About UFACTORY Account</h3>
            <article>
              <p>UFACTORY Account gives you access to uArm Studio (PC), uArm Play (Mobile App) and UFACTORY official website.
                Currently, you’re allowed to:</p>
              <p>- Receive first-hand information about the latest update of uArm products, software, discounts, etc. </p>
              <p>- Sync Blockly projects in Studio among different devices.</p>
              <p>- Sync Blockly projects in Studio with uArm Play (Mobile App)</p>
              <p>More features will come up to support and connect uArm users!</p>
            </article>
        </div>
        <div class="account-wrapper" v-show="language === 'cn'">
            <h3>关于UFACTORY用户账号</h3>
            <article>
              <p>您可使用UFACTORY账号登录uArm Studio（PC端软件）、uArm Play（手机App）以及UFACTORY官方网站，并使用里面的所有功能，以及：</p>
              <p>- 获取来自uArm团队的一手资讯（产品及软件更新、新功能新玩法、优惠折扣，等等） </p>
              <p>- 让您的Blockly项目在不同设备上保持同步</p>
              <p>- 将您在Studio创建的Blockly项目同步到uArm Play（手机App），随时随地运行</p>
              <p>未来将会拓展更多功能，敬请期待！</p>
            </article>
        </div>
      </div>


      <div class="policy-wrapper" v-show="page === '2' && language === 'en'">
        <div class="terms-conditions" >
          <h3>UFACTORY Account Terms and Conditions </h3>
          <article>
            <p>If you want to create a UFACTORY Account, please read the Terms and Conditions carefully and tick the “agree” checkbox.</p>
            <p>This documents clarifies the conditions of registering and using UFACTORY Account.
            You may register and sign in your Account (“Account”) through www.ufactory.cc, or UFACTORY software including uArm Studio and uArm Play. </p>
            <p>1.Who are we?<br/>
            We are UFACTORY Co. Ltd. (“we”, “us”, “our”), a company established under the law of People’s Republic of China (PRC). Our registered address is: 2F, Building M6, Ma Que Ling Industrial Zone, Nanshan District, Shenzhen, Guangdong Province. You may contact us via email: info@ufactory.cc.
            We offer desktop robotic arms and accessories of robotic arms for robot hobbyists, researchers, students and educators. </p>
            <p>2.Terms of Account<br/>
            When you register for an Account, you will be asked to provide your personal information. We will process your information according to our Privacy Policy.
            We may update our website and software from time to time to modify the content of the Terms. Your continuing to use the Account means your consent to the changes.
            Violations of the Terms may result in cancellation of your Account. </p>
            <p>3.Password and Safety<br/>
            Please keep your username and password safe. You need to be responsible for all activities you have done with the Account,
             regardless of your permission to those activities (except for activities caused by security vulnerabilities or our fault).</p>
          </article>
        </div>
        <div class="policy">
          <h3>Privacy Policy </h3>
          <article>
              <p>Hello, and welcome to our Privacy Policy.This Privacy Policy helps you to make informed decisions about your relationship with us,
              so please read it carefully.</p>
            <div>
                <h4>1. Introduction</h4>
                Thanks for choosing uArm made by UFACTORY. To provide you with UFACTORY Service (“Service”), UFACTORY (“we”, “us”, “our”) needs to collect some information about you, and this Privacy Policy is where we describe the information we collect, what we do with it, and how you can manage and control the use of your information. By using or interacting with the Service, you are entering into a binding contract with us and consenting to the use of your information as explained in this Privacy Policy. If you don't agree with these terms, then please don't use the Service.
            </div>
            <div>
                <h4>2. The information we collect</h4>
                <p>2.1 Registration data<br/>
                When you sign up for the Service, we may collect information we ask you for, like your username, password, e-mail address, date of birth, gender, and country. We may also collect information you voluntarily add to your profile, such as your occupation.
                </p>
                <p>2.2 Usage, Log Data & Cookies<br/>
                When you use the Service, we automatically collect certain information, including: <br/>
                (i) information about interactions with the Service, including the features you have used, sign-in/off time and device connection
                 information;
                  (iii) technical data, including the URL you are coming from, your IP address, unique device ID, network and computer performance,
                  browser type, language and identifying information, and operating system.We may use cookies and similar technologies to collect this
                   information and you can learn more about such use at the bottom of this Privacy Policy.

                </p>
            </div>
            <div>
                <h4>3. Why we collect your information</h4>
                We collect your information to:<br/>
                - authenticate your identity and thus avoid deceitful behaviour<br/>
                - clarify your needs for technical services<br/>
                - offer product & services you needed<br/>
                - improve our products (website, software, and hardware) according to your usage
            </div>
            <div>
                <h4>4. Security</h4>
                We are committed to protecting our users’ information. Your information will be encrypted by Security Socket Layer (SSL) before we received it. And currently we are not partnering with any Third Party institutions for information sharing.
                Your password protects your user account, so you should use a unique and strong password and limit access to your computer and browser. While we take reasonable data protection precautions, no security measures are completely secure, and we do not guarantee the security of user information at any time.
            </div>
            <div>
                <h4>5. Changes to the Privacy Policy</h4>
                We may make changes to this Privacy Policy from time to time, so please visit this Privacy Policy regularly. If we make changes which we believe are material, we will inform you through the Service. Your continued use of the Service thereafter constitutes acceptance of the changes.
            </div>
          </article>
        </div>
      </div>
      <div class="policy-wrapper" v-show="page === '2' && language === 'cn'">
        <div class="terms-conditions">
          <h3>UFACTORY用户账户条款与条件</h3>
          <article>
            <p>如果您想创建UFACTORY账号，请仔细阅读本用户账户条款，然后勾选“接受”框。</p>
            <p>本用户账户条款与网站条款规定了您可以注册和使用账户的基本条件，您可在www.ufactory.cc 以及UFACTORY官方软件uArm Studio,
            uArm Play的登录页面输入唯一用户名和密码访问您的账户（“账户”)。</p>
            <p>1.我们是谁？<br/>
            我们是UFACTORY Co. Ltd.（“我们”），一家依中华人民共和国法律成立的公司，注册办公地位于中国广东省深圳市南山区麻雀岭工业园区M6栋二层。您可通过电子邮箱info@ufactory.cc 联系我们。
            我们是一家生产和销售桌面机械臂及其配件的公司。</p>
            <p>2.本用户账户条款<br/>
            创建账户时，系统会要求提供关于您本人的特定信息。我们将根据 （隐私政策） 处理您的所有个人信息。
            我们可能会不时更新网站和软件，以修改本用户账户条款的内容。用户账户条款更改后，如果继续使用账户即表示您同意条款内容的更改。
            如果您违反本用户账户条款，我们可能撤销您对网站和软件的访问和使用权。</p>
            <p>3.密码和安全<br/>
            您需要确保以安全、保密的方式保存您的用户名和密码。您需要对通过账户做出的所有活动和指示负责，
            不论您是否许可这些行为（但因安全漏洞或我们未能遵守本用户账户条款而发生的活动除外）。</p>
          </article>
        </div>
        <div class="policy">
            <h3>隐私政策</h3>
            <article>
              <p>你好，欢迎浏览我们的隐私政策。此文档会帮助您了解我们如何收集、使用您的信息，以便您做出响应的决策。</p>
              <div>
                  <h4>1. 简介</h4>
                  感谢您选择uArm和UFACTORY账号服务（“服务”）。为了向您提供操作机械臂所需要的服务，UFACTORY（“我们”）需要向您收集个人信息。本隐私政策会描述我们所收集的信息类型，收集目的以及使用方式。使用我们的服务即表明您同意本隐私政策的内容。
              </div>
              <div>
                <h4>2. 我们收集的信息</h4>
                2.1 注册信息<br/>
                <p>当您注册账号时，我们会向您收集：用户名、密码、邮箱地址、出生日期、性别和所在国家。除此以外，我们还会收集您自愿提供的信息，如您的职业。</p>
                2.2 登录/使用数据以及Cookies<br/>
                当您使用服务时，我们会自动收集以下信息：<br/>
                （1）您与UFACTORY服务互动的信息，包括您使用的软件功能、登录/退出登录时间和设备连接信息；<br/>
                （2）您通过设备所发出的请求；<br/>
                （3）您的技术环境：您的URL、IP地址、设备ID、网络和电脑性能、浏览器类型、语言和操作系统<br/>
                我们会通过Cookies和类似的技术去收集以上信息。<br/>
               </div>
               <div>
                    <h4>3. 收集信息的目的</h4>
                    我们收集您的信息的目的包括：<br/>
                    - 验证您的身份以防欺诈行为<br/>
                    - 明确您的技术服务需求<br/>
                    - 向您提供合适的产品和服务<br/>
                    - 根据您的使用习惯改进我们的产品（网站、软件和硬件）<br/>
                </div>
                <div>
                    <h4>4. 信息安全</h4>
                    我们会保护您的个人信息安全。安全服务器软件（SSL）将会对您的信息加密后再发送给我们。目前，我们没有和任何第三方机构达成信息共享协议。因此我们不会向任何第三方机构共享您的信息。
                    您的密码会保证您的账号安全，请使用保密性强的密码，并限制其他人使用您的电脑和浏览器。虽然我们已经采取了安全措施，但由于没有绝对安全的措施，我们在任何时候都不能保证您个人信息的绝对安全。
                </div>
                <div>
                    <h4>5. 隐私政策改动</h4>
                    我们会时不时改动隐私政策的内容，请定期浏览本隐私政策。如果我们做出了改动，我们会通过产品和服务通知您。若您继续使用该服务，则代表您已同意政策内容的改动。
                </div>
            </article>
        </div>
      </div>
      <div class="close-wrapper">
        <a class="close-btn" @click="goBackLogin">{{$t('common.close')}}</a>
      </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      language: 'en',
      page: '',
      registerData: null,
      loginData: null,
    };
  },
  mounted() {
    this.language = this.$t('language'); //  === 'en' ? 'cn' : 'en'
    this.page = this.$route.params.page;
    this.loginData = this.$route.params.loginData;
    this.registerData = this.$route.params.registerData;
  },
  methods: {
    goBackLogin() {
      if (this.$route.params.state === '2') {
        this.$router.push({ name: 'login', params: { state: '2', loginData: this.loginData } });
      }
      else {
        this.$router.push({ name: 'login', params: { state: '3', registerData: this.registerData } });
      }
    },
  },
  components: {
  },
  computed: {
  },
};

</script>

<style lang="sass" scoped>
.text-wrapper {
    border: 1px solid rgba(85, 85, 85, 0.15);
    padding:2vw 8vw;
    height:100%;
    .policy-wrapper {
        overflow-y: scroll;
        overflow-x: visible;
        height:90%;
    }
  .close-wrapper {
    position:relative;
    height:60px;
    line-height:60px;
    width:50px;
    margin:20px auto;
    text-align: center;
    vertical-align: middle;
  .close-btn {
      display:block;
      line-height: 36px;
      color: black;
      cursor: pointer;
      padding: 0 2px;
      border-radius:2px;
      font-size:14px;
      background:#5A93D7;
      color:#fff;
      opacity:1;
      text-decoration: none;
    }
  }

}

</style>
