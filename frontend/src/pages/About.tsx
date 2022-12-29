import { AnimatedPage } from "../components/templates";


const About = () => {
  return (
    <AnimatedPage>
      <div className="main_ct1">
        <p>
          APPLICABLE AI
          <br/>
          <span>for Your Business</span>
        </p>
      </div>
      
      <div className="main_ct2">
        <div className="flex_box">
          <div className="left_content">
            <div className="txt_center">
              <h4 className="blue_g">
                  Who are we?
              </h4>
            </div>
            <h5>
              Outstanding Performance<br/>in AI 🤖
            </h5>
            <p>
              AAAI, WWW, WSDM 등 <span className="blue">글로벌 Top AI 학회 논문 성과</span><br/>
              텍스트, 이미지, 음성 등 <span className="blue">다양한 도메인에 대한 경험 보유</span><br/>
              인공지능 기술력을 바탕으로 <span className="blue">기업이 가진 문제를 해결</span><br/>
            </p>
          </div>
          <div className="right_content">
            <img src="/img/ai_business.png" alt="AI Business" width={450}/>
          </div>
        </div>
      </div>

      <div className="main_ct3">
        <div className="inner">
          <div className="txt_center">
            <h4 className="blue_g">
              Our Publications
            </h4>
          </div>
          <h5>최신 인공지능 기술을 연구하는 전문가 집단</h5>
          <p>인공지능 분야에서 AAAI, EMNLP, WWW 등 최우수국제학술대회를 포함한 <strong>100편 이상의 논문 게재</strong></p>
          <ul className="list">
            <li>
              <h6>D-Vlog: Multimodal Vlog Dataset for Depression Detection</h6>
              <p>Jeewoo Yoon, Chaewon Kang, Seungbae Kim, and Jinyoung Han</p>
              <p>AAAI Conference on Artificial Intelligence (AAAI)</p>
            </li>
            <li>
              <h6>Multimodal Post Attentive Profiling for Influencer Marketing</h6>
              <p>Seungbae Kim, Jyun-Yu Jiang, Masaki Nakada, Jinyoung Han, and Wei Wang</p>
              <p>The WEB Conference (formerly WWW)</p>
            </li>
          </ul>
          <ul className="list">
            <li>
              <h6>Cross-Lingual Suicidal-Oriented Word Embedding
                  toward Suicide Prevention</h6>
              <p>Daeun Lee, Soyoung Park, Jiwon Kang, Daejin Choi, and
                  Jinyoung Han</p>
              <p>EMNLP Findings</p>
            </li>
            <li>
              <h6>VCTUBE: A Library for Automatic Speech Data
                  Annotation</h6>
              <p>Seong Choi, Seunghoon Jeong, Jeewoo Yoon,
                  Migyeong Yang, Minsam Ko, Eunil Park, Jinyoung Han, Munyoung Lee, and Seonghee Lee</p>
              <p>INTERSPEECH, Show &amp;Tell</p>
            </li>
          </ul>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default About;