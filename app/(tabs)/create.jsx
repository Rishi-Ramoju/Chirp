import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
// import { ResizeMode, Video } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../../constants";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useVideoPlayer, VideoView } from "expo-video";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const player = useVideoPlayer(
    {
      uri: form.video?.uri,
    },
    (player) => {}
  );

  const openPicker = async (selectType) => {
    // const result = await DocumentPicker.getDocumentAsync({
    //   type:
    //     selectType === "image"
    //       ? ["image/png", "image/jpg",'image/jpeg']
    //       : ["video/mp4", "video/gif"],
    // });
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? "images" : "videos",
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      if (selectType === "image")
        setForm({ ...form, thumbnail: result.assets[0] });
      if (selectType === "video") setForm({ ...form, video: result.assets[0] });
    }
  };

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt)
      Alert.alert("Please fill in all th fields");

    setUploading(true);
    try {
      await createVideo({ ...form, userId: user.$id });
      Alert.alert("Success", "Post uploaded successfully.");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Enter video title"
          handleChangeText={(e) => {
            setForm({ ...form, title: e });
          }}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              // <Video
              //   source={{ uri: form.video.uri }}
              //   className="w-full h-64 rounded-2xl"
              //   resizeMode={ResizeMode.COVER}
              // />
              <VideoView className="w-full h-64 rounded-2xl" player={player} />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="contain"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium ml-2">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="Enter prompt used to generate this video"
          handleChangeText={(e) => {
            setForm({ ...form, prompt: e });
          }}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Publish Video"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
