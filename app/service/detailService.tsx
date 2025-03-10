import { Image, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/buttonDefault/backButton";
import DropdownComponent from "@/components/default/dropdown";
import TextArea from "@/components/default/textArea";
import InfoButton from "@/components/buttonDefault/infoButton";
import RadioPriceButton from "@/components/buttonDefault/radioPriceButton";
import { Button } from "react-native-paper";
import FooterDetailService from "@/components/services/footerDetailService";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams } from "expo-router";
import ServiceApi from "@/api/service";
import { ListDetailServiceInterface, ServiceInterface } from "@/types/service";
import ListDetailServiceApi from "@/api/listIconService";
const data = [
  { label: "Item 1", id: "1" },
  { label: "Item 2", id: "2" },
  { label: "Item 3", id: "3" },
  { label: "Item 4", id: "4" },
  { label: "Item 5", id: "5" },
  { label: "Item 6", id: "6" },
  { label: "Item 7", id: "7" },
  { label: "Item 8", id: "8" },
];

const DetailService = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  const [radio, setRadio] = useState(1);
  const serviceApi = new ServiceApi();
  const listDetailServiceApi = new ListDetailServiceApi();
  const { idService } = useLocalSearchParams();
  const [service, setService] = useState<ServiceInterface>();
  const [listDetailService, setListDetailService] = useState<ListDetailServiceInterface>();
  useEffect(() => {
    console.log(selectedValue, idService);
    const fetchDataService = async () => {
      const res = await serviceApi.getId(Number(idService));
      const dataListService = await listDetailServiceApi.getListService(Number(idService));

      console.log(res,dataListService);

      setService(res);
      setListDetailService(dataListService);
    };
    fetchDataService();
  }, [idService]);
  console.log(service);

  return (
    <View className="relative">
      <BackButton />
      <InfoButton />
      <FooterDetailService />
      {service && (
        <ScrollView className="h-full bg-white">
          <View>
            <Image
              style={{ height: hp(32), width: wp(100) }}
              source={{ uri: service.imageUrl }}
            />
          </View>

          <View className="rounded-t-3xl bg-white -mt-12 pt-6">
            <View className="px-5">
              <Text className="text-3xl font-bold mb-4">{service.name}</Text>
              <Text className="mb-6">
                {service.description}
              </Text>
              <DropdownComponent
                data={listDetailService}
                onSelect={(value: any) => setSelectedValue(value)}
              />
              {selectedValue && (
                <View className="mt-5">
                  <Text>Hãy chọn các gói phù hợp với bạn{selectedValue}</Text>
                  <RadioPriceButton
                    options={[
                      { id: 1, label: "Gói 1", value: "100000" },
                      { id: 2, label: "Gói 2", value: "120000" },
                      { id: 3, label: "Gói 3", value: "130000" },
                    ]}
                    checkedValue={radio}
                    onChange={setRadio}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default DetailService;
