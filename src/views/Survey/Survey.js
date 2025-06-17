import {Platform, Dimensions, View, ScrollView, SafeAreaView, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useOvermind} from '@/store';
import {MainMediumFont, MainRegularFont, MainSemiBoldFont} from '@/views/Components';
import {Styles} from '@/styles';
import Swiper from 'react-native-swiper';
import {json} from 'overmind';

const Survey = (props) => {
  const {state, actions} = useOvermind();
  const answers = [1, 2, 3, 4, 5];
  const survey = props.route?.params?.survey;
  const [questions, setQuestions] = useState(json(survey?.questions));
  const [index, setIndex] = useState(0);
  const swiper = useRef(null);

  const onSubmit = async () => {
    if (!questions[index].answer) {
      actions.alert.showError({message: 'Please select an answer', title: 'Flute'})
    }
    if (index === questions.length - 1) {
      actions.hud.show();
      try {
        const answers = [];
        questions?.map(q => {
          answers.push({
            question: {connect: {id: q?.id}},
            answer: q?.answer?.toString()
          })
        })
        await actions.userSurvey.saveUserSurvey({
          data: {
            survey: {connect: {id: survey?.id}},
            answers: {create: answers},
            user: {connect: {id: state.currentUser?.id}}
          }
        })
        
        props.navigation.navigate('DoneSurvey');
      } catch (e) {
        console.log(e)
      } finally {
        actions.hud.hide()
      }
    } else {
      swiper.value.scrollTo(index + 1);
    }
  };

  const onSelectAnswer = (i, answer) => {
    const items = [...questions];
    items[i].answer = answer;
    setQuestions(items);
  };
  return (
    <Container>
      <SafeAreaView style={{flex: 1}}>
        <Title>REDEMPTION SURVEY</Title>
        <Swiper
          ref={r => swiper.value = r}
          horizontal
          loop={false}
          showButtons={false}
          removeClippedSubviews={false}
          activeDotColor='black'
          onIndexChanged={(i) => {
            setIndex(i);
          }}>
          {questions?.map((question, i) => (
            <QView key={i}>
              <QuestionView>
                <QuestionText>{question?.question}</QuestionText>
              </QuestionView>
              <ScrollView
                style={{flex: 1}}
                contentContainerStyle={{alignItems: 'center', width: Dimensions.get('window').width}}>
                <Desc>Strongly disagree</Desc>
                {answers?.map((answer, index) => (
                  <AnswerBtn
                    isSelected={question?.answer === answer}
                    key={index}
                    onPress={() => onSelectAnswer(i, answer)}>
                    <AnswerText isSelected={question?.answer === answer}>{answer}</AnswerText>
                  </AnswerBtn>
                ))}
                <Desc>Strongly agree</Desc>
              </ScrollView>
            </QView>
          ))}
        </Swiper>
        <SubmitBtn onPress={() => onSubmit()}>
          <SubmitText>SUBMIT ANSWER</SubmitText>
        </SubmitBtn>
      </SafeAreaView>
    </Container>
  );
};

const QView = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
`;

const SubmitText = styled(MainRegularFont)`
  color: black;
  font-size: 12px;
  letter-spacing: 3px;
`;

const SubmitBtn = styled.TouchableOpacity`
  background-color: #d6b839;
  height: 44px;
  border-radius: 2px;
  margin-horizontal: 20px;
  margin-bottom: 30px;
  ${Styles.center}
  align-self: stretch;
`;

const AnswerText = styled(MainMediumFont)`
  color: ${(props) => (props.isSelected ? '#fff' : '#000')}
  font-size: 32px;
`;

const AnswerBtn = styled.TouchableOpacity`
  width: 62px;
  height: 62px;
  border-radius: 31px;
  background-color: ${(props) => (props.isSelected ? '#D9AF46' : '#fff')};
  margin-vertical: 5px;
  ${Styles.center}
`;

const Desc = styled(MainMediumFont)`
  color: white;
  font-size: 16px;
  margin-vertical: 10px;
`;

const QuestionText = styled(MainMediumFont)`
  color: white;
  font-size: 27px;
`;

const QuestionView = styled.View`
  margin-horizontal: 30px;
  margin-top: 16px;
  ${Styles.center};
  border-bottom-width: 1px;
  border-color: #dedede;
  padding-vertical: 15px;
`;

const Title = styled(MainSemiBoldFont)`
  color: #d9af46;
  font-size: 12px;
  margin-top: 20px;
  margin-left: 30px;
`;

const Container = styled.View`
  flex: 1;
  background-color: black;
  justify-content: center;
`;

export default Survey;
