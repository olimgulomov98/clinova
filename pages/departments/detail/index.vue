<template>
  <div class="page-container">
    <div class="flex items-center gap-x-2">
      <v-button @click="navigateTo('/departments')">
        <icon-arrow-left/>
      </v-button>
      <div>
        <div class="desc">
          Back to Department List
        </div>
        <div class="page-title">
          Department Details
        </div>
      </div>
    </div>
    <div class="card-container">
      <div class="image-section">
        <img src="https://www.shutterstock.com/image-photo/full-body-side-view-fun-600nw-2450166287.jpg" alt="">
      </div>
      <div class="card-footer">
        <div class="title truncate">
          Anvar Abdullayev
        </div>
        <div class="avatar-group">
          <div class="more mr-3">Team:</div>
          <div class="avatar"></div>
          <div class="avatar"></div>
          <div class="avatar"></div>
          <div class="avatar"></div>
          <div class="avatar"></div>
          <el-dropdown>
            <div class="more">+10 others</div>
            <template #dropdown>
              <el-dropdown-menu class="!p-0">
                <el-dropdown-item>
                  <div class="dropdown-item">
                    <div class="avatar"></div>
                    <div class="person-name truncate">
                      Sherzod Shukurovich
                    </div>
                  </div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div class="dropdown-item">
                    <div class="avatar"></div>
                    <div class="person-name truncate">
                      Sherzod Shukurovich
                    </div>
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

      </div>
    </div>
    <div class="detail-section-title">
      About
    </div>
    <div class="desc">
      The General Medicine Department at WellNest Hospital is dedicated to providing comprehensive healthcare services
      to patients of all ages. Our team of experienced physicians and healthcare professionals focuses on the
      prevention, diagnosis, and treatment of a wide range of medical conditions. We emphasize a holistic approach to
      healthcare, considering the physical, emotional, and social aspects of health. Our goal is to ensure that every
      patient receives personalized care tailored to their unique needs, promoting overall well-being and long-term
      health.
    </div>
    <div class="detail-section-title">
      Our Treatments
    </div>
    <div class="treatments-box">
      <div class="pt-1">
        <icon-pointer/>
      </div>
      <div class="right-section">
        <div class="title">
          Routine Check-Ups
        </div>
        <div class="desc">
          Regular health assessments to monitor and maintain overall health, including physical examinations, health
          screenings, and preventive care.
        </div>
      </div>
    </div>
    <div class="treatments-box">
      <div class="pt-1">
        <icon-pointer/>
      </div>
      <div class="right-section">
        <div class="title">
          Chronic Disease Management
        </div>
        <div class="desc">
          Comprehensive care plans for managing chronic conditions such as diabetes, hypertension, and asthma, aimed at
          improving quality of life and preventing complications.
        </div>
      </div>
    </div>
    <div class="treatments-box">
      <div class="pt-1">
        <icon-pointer/>
      </div>
      <div class="right-section">
        <div class="title">
          Acute Illness Treatment
        </div>
        <div class="desc">
          Prompt and effective treatment for acute illnesses such as infections, flu, and minor injuries, ensuring quick
          recovery and minimizing discomfort.
        </div>
      </div>
    </div>
    <div class="treatments-box">
      <div class="pt-1">
        <icon-pointer/>
      </div>
      <div class="right-section">
        <div class="title">
          Preventive Care
        </div>
        <div class="desc">
          Services aimed at preventing diseases and promoting health, including vaccinations, health education, and
          lifestyle counseling.
        </div>
      </div>
    </div>
    <div class="treatments-box">
      <div class="pt-1">
        <icon-pointer/>
      </div>
      <div class="right-section">
        <div class="title">
          Geriatric Care
        </div>
        <div class="desc">
          Specialized care for older adults, addressing the unique health challenges of aging and providing support for
          maintaining independence and quality of life.
        </div>
      </div>
    </div>
    <div class="detail-section-title">
      Our Team
    </div>
    <div class="team-cards">
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
      <div class="card">
        <div class="image">

        </div>
        <div>
          <div class="title">
            Dr. Petra Winsburry
          </div>
          <div class="desc">
            Routine Check-Ups
          </div>
        </div>
        <div class="flex gap-x-2 justify-center">
          <icon-linkedin-logo/>
          <icon-twitter-logo/>
          <icon-instagram-logo/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped lang="scss">
.desc {
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #87888A;

}

.card-container {
  width: 100%;
  border-radius: 16px;
  display: flex;
  flex-flow: column;
  gap: 12px;

  .image-section {
    width: 100%;
    border-radius: 12px;
    height: 460px;
    background: #e5e5e5;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }
  }


  .description {
    font-weight: 400;
    font-family: "SourceSans3", sans-serif;
    font-size: 14px;
    color: #87888A;
  }

  .card-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 32px;
      font-family: "SourceSans3", sans-serif;
      font-weight: 600;
      color: #233955;

    }

    .avatar-group {
      display: flex;
      align-items: center;

      .avatar {
        width: 24px;
        height: 24px;
        border: 1px solid #ffffff;
        border-radius: 50%;
        background-color: #aef5f5;
        margin-left: -6px;
        box-shadow: 0 0 0 1px #e0e0e0;

        &:first-child {
          margin-left: 0;
        }
      }

      .avatar:hover {
        z-index: 2;
      }

      .more {
        font-family: "SourceSans3", sans-serif;
        font-weight: 400;
        font-size: 12px;
        line-height: 150%;
        margin-left: 8px;
        white-space: nowrap;
        color: #87888A;
        cursor: pointer;
        outline: none;
      }

      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0 12px;

        .avatar {
          width: 24px;
          height: 24px;
          border: 1px solid #ffffff;
          border-radius: 50%;
          background-color: #aef5f5;
          margin-left: -6px;
          box-shadow: 0 0 0 1px #e0e0e0;

          &:first-child {
            margin-left: 0;
          }
        }

        .person-name {
          font-family: "SourceSans3", sans-serif;
          font-weight: 400;
          font-size: 12px;
          line-height: 150%;
          margin-left: 8px;
          white-space: nowrap;
          color: #05080B;
        }
      }
    }

  }
}

.detail-section-title {
  font-family: "SourceSans3", sans-serif;
  font-weight: 600;
  font-size: 26px;
  color: #C3C4C4;
}

.desc {
  font-family: "SourceSans3", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  color: #4B4D4F;
}

.treatments-box {
  display: flex;
  align-items: start;
  gap: 12px;

  .right-section {
    .title {
      font-family: "SourceSans3", sans-serif;
      font-weight: 600;
      font-size: 18px;
      color: #4B4D4F;
    }

    .desc {
      font-family: "SourceSans3", sans-serif;
      font-weight: 400;
      font-size: 16px;
      color: #4B4D4F;

    }
  }
}

.team-cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  grid-gap: 20px;
  align-items: end;

  .card {
    width: 100%;
    gap: 16px;
    border-radius: 16px;
    padding: 16px;
    background: #F5F5F5;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-flow: column;

    .image {
      width: 56px;
      height: 56px;
      border-radius: 8px;
      background: #A2F2EE;
    }

    .title {
      font-family: "SourceSans3", sans-serif;
      font-weight: 600;
      font-size: 18px;
      text-align: center;
      color: #4B4D4F;
    }

    .desc {
      font-family: "SourceSans3", sans-serif;
      font-weight: 400;
      font-size: 14px;
      text-align: center;
      color: #87888A;

    }
  }
}
</style>