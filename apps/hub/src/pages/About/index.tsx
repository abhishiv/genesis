/** @jsx h **/

import { component, h } from "rocky7";
import juliePic from "@app/images/team/julie.png";
import abhishivPic from "@app/images/team/abhishiv.png";
import styles from "./About.module.css";
import { setTitle } from "@app/utils/index";
const teamMembers = [
  //  {
  //    name: "Li Zhu",
  //    title: "Maintainer",
  //    linkedin: "https://it.linkedin.com/in/juliezhu",
  //  },
  {
    name: "Abhishiv Saxena",
    title: "CEO",
    linkedin: "https://www.linkedin.com/in/abhishivsaxena",
    pic: abhishivPic,
  },
  //  {
  //    name: "Li Zhu",
  //    title: "CTO",
  //    linkedin: "https://it.linkedin.com/in/juliezhu",
  //    pic: juliePic,
  //  },
  //  {
  //    name: "You!",
  //    title: "Developer/Designer/Maker",
  //    link: "mailto:team@grati.co",
  //    stub: true,
  //  },
];

export const About = component("About", () => {
  setTitle("About");
  return (
    <div class={styles.page}>
      <section>
        <h3>
          {" "}
          <i class="las la-yin-yang"></i> Manifesto{" "}
        </h3>
        <div>
          <strong>grati.co OÜ</strong> is a Tallinn based company mainstreaming
          innovation from Programming Language academia into popular use.
        </div>
      </section>

      <section style="display: none;">
        <h3>
          {" "}
          <i class="las la-users"></i> Team
        </h3>
        <div class={styles.team}>
          {teamMembers.map((el, i) => {
            return (
              <div class={styles.member} key={i}>
                <div class={styles.pic}>
                  <img src={el.pic} />
                </div>
                <div class={styles.profile}>
                  <div>
                    <strong>{el.name}</strong>
                  </div>
                  <div>
                    <a target="_blank" href={el.linkedin} rel="noreferrer">
                      <i class="lab la-linkedin"></i>
                    </a>{" "}
                    {el.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        <h3>
          {" "}
          <i class="las la-file-contract"></i> Legal
        </h3>
        <p></p>
        <p>
          <strong>
            <i class="las la-map-marked"></i> Registered Address:
          </strong>{" "}
          <br />
          Ahtri tn 12,
          <br /> Tallinn 10151
        </p>
        <p>
          <strong>
            <i class="las la-building"></i> Registrikood:
          </strong>{" "}
          16122975
        </p>
        <p>
          <strong>
            <i class="las la-euro-sign"></i> VAT:
          </strong>{" "}
          EE102332045
        </p>
      </section>
    </div>
  );
});
