import AnimationRevealPage from "helpers/AnimationRevealPage";
import React, { Component } from "react";
import { useLocation, useHistory } from "react-router-dom";
import tw from "twin.macro";

import Feature from "components/features/TwoColSingleFeatureWithStats2-button.js";
import Header from "components/headers/light.js";
import Footer from "components/footers/Home-Footer";
import { eventMap } from "../eventMap";
// import { createBrowserHistory } from 'history'

// export const history = createBrowserHistory({forceRefresh: true})

import { Container as ContainerBase } from "components/misc/Layouts";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "images/signup-illustration.svg";
import logo from "images/old-logo-symbol.png";
import googleIconImageSrc from "images/google-icon.png";
import twitterIconImageSrc from "images/twitter-icon.png";
import { ReactComponent as SignUpIcon } from "feather-icons/dist/icons/user-plus.svg";
import { Link } from "react-router-dom";
import { backendUrl } from "backendUrl";
//import {backendUrl} from "backendUrl.js";

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-32 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-primary-500 text-gray-100 w-full py-4 rounded-lg hover:bg-primary-900 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full max-w-lg bg-contain bg-center bg-no-repeat`}
`;

function goBackToEvents(history) {
  history.push("/events");
  history.go(0);
}

function EventRegistration() {
  const location = useLocation();
  const card = location.state;
  const history = useHistory();

  if (!card) goBackToEvents(history, card);

  console.log(card.teamSize);
  const SubmitButtonIcon = SignUpIcon;
  const submitButtonText = "Submit";

  const handleSubmit = (e) => {
    e.preventDefault();
    const email_list = [];
    for (let i = 0; i < card.teamSize-1; i++) {
      const num = i+2;
      const search = "email" + num;
      const email = e.target[search].value;
      if(email !== ""){
        email_list.push(email);
      }
    }
    console.log(email_list);

    const data = {
      teamname: e.target.elements.teamname.value,
      email_list: email_list,
      event_registered: eventMap[card.title],
    };
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(data),
    };
    fetch(backendUrl + "/api/create_team/", requestOptions)
      .then((response) => {
        if (response.status === 201) {
          alert("Successfully Registered");
          goBackToEvents(history, card);
        } 
        else if(response.status==409){
          alert("Team Already Exists");
        }else {
          alert("Error in registering");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;
  return (
    <AnimationRevealPage>
      {/* <Header /> */}
      <Container>
        <Content>
          <MainContainer>
            <Link to="/">
              <LogoLink>
                <LogoImage src={logo} />
              </LogoLink>
            </Link>
            <MainContent>
              <Heading>{card.title}</Heading>
              <FormContainer>
                <Form id="myForm" onSubmit={handleSubmit}>
                  <Input type="name" placeholder="Team Name" name="teamname" />
                  {Array.from(
                    { length: card.teamSize - 1 },
                    (_, i) => i + 2
                  ).map((val, index) => (
                    <div>
                      <DividerTextContainer>
                        <DividerText>Team Member: {val}</DividerText>
                      </DividerTextContainer>
                      <Input
                        type="email"
                        placeholder="Email"
                        name={`email${val}`}
                      />
                      <Input type="name" placeholder="Name" name="name" />
                      <Input
                        type="phone"
                        placeholder="Phone Number"
                        name="phone_number"
                      />
                    </div>
                  ))}
                  <SubmitButton type="submit">
                    <SubmitButtonIcon className="icon" />
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
          {/* <IllustrationContainer>
                <IllustrationImage imageSrc={illustrationImageSrc} />
              </IllustrationContainer> */}
        </Content>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
}

export default EventRegistration;