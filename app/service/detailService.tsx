import { Image, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/buttonDefault/backButton";
import DropdownComponent from "@/components/default/dropdown";
import InfoButton from "@/components/buttonDefault/infoButton";
import RadioPriceButton from "@/components/buttonDefault/radioPriceButton";
import FooterDetailService from "@/components/services/footerDetailService";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams } from "expo-router";
import ServiceApi from "@/api/service";
import {
  ListDetailServiceInterface,
  PricesServiceInterface,
  ServiceInterface,
} from "@/types/service";
import ListDetailServiceApi from "@/api/listIconService";
import PriceServiceApi from "@/api/priceService";

const DetailService = () => {
  const { idService } = useLocalSearchParams();
  const serviceApi = new ServiceApi();
  const priceServiceApi = new PriceServiceApi();
  const listDetailServiceApi = new ListDetailServiceApi();
  const [radio, setRadio] = useState("");
  const [active, setActive] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [service, setService] = useState<ServiceInterface>();
  const [option, setOption] = useState<PricesServiceInterface[]>();
  const [listDetailService, setListDetailService] =
    useState<ListDetailServiceInterface>();
  useEffect(() => {
    const fetchDataService = async () => {
      console.log(idService)
      const res = await serviceApi.getId(idService as string);
      const dataListService = await listDetailServiceApi.getListService(
        idService as string
      );
      console.log(res,dataListService)
      if (res) {
        setService(res);
      }
      if (dataListService) {
        setListDetailService(dataListService);
      }
    };
    fetchDataService();
  }, [idService]);

  useEffect(() => {
    if (selectedValue) {
      console.log(selectedValue);
      const fetchDataPackageSelect = async () => {
        const res = await priceServiceApi.getByUnit(selectedValue);
        if (res) {
          console.log(res)
          setOption(res);
        }
      };
      fetchDataPackageSelect();
    }
  }, [selectedValue]);

  useEffect(() => {
    if (option && option.length > 0) {
      setRadio(option[0].id);
      setActive(true);
    }
  }, [option]);
  return (
    <View className="relative">
      <BackButton />
      <InfoButton />
      {service && (
        <ScrollView
          className="h-full bg-white"
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <View>
            <Image
              style={{ height: hp(32), width: wp(100) }}
              source={{ uri: service.imageUrl }}
            />
          </View>
          <View className="rounded-t-3xl bg-white -mt-12 pt-6">
            <View className="px-5">
              <Text className="text-3xl font-bold mb-4">{service.name}</Text>
              <Text className="mb-6">{service.description}</Text>
              <DropdownComponent
                data={listDetailService}
                onSelect={(unit: any) => setSelectedValue(unit)}
              />
              {option && (
                <View className="mt-5 pb-10">
                  <Text>Hãy chọn các gói phù hợp với bạn </Text>
                  <RadioPriceButton
                    options={option}
                    checkedValue={radio}
                    onChange={setRadio}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      <FooterDetailService
        unit={selectedValue}
        serviceId={idService}
        typeService={radio}
        isActive={active}
      />
    </View>
  );
};

export default DetailService;
