import {Params} from '@angular/router';
import {parseParamsToArray} from '@helpers';
import {
  conditionalStatusToBoolean,
  CrewSearchAdditionalFilterForm,
  CrewSearchFilterForm,
  CrewSearchInputFilterForm,
  SearchLocationForm
} from '@models';
import {ExpectedSalaryFormI} from '@controls/expected-salary-form';
import {CheckboxGroupedValue} from '@controls/seazone-checkbox-group';
import {AvailabilityFormI} from '@controls/availability-form';
import {LocationLatLngDto} from '@controls/location-autocomplete';
import {LanguageLevelFormI} from '@controls/language-level-form';

export class SearchCrewParamsToFormService {

  public static mapParamsToFilterForm(params: Params): CrewSearchFilterForm {
    const {
      offer,
      positionGroup,
      position,
      lookingJobStatus,
      availabilityStatus,
      contractType,
      expectedSalaryCurrency,
      expectedSalaryMin,
      expectedSalaryMax,
      professionalSkills,
      yachtExperienceMin,
      yachtExperienceMax,
      notSmocking,
      notVisibleTattoos,
      availabilityDate,
      languageOneValue,
      languageOneLevel,
      languageTwoValue,
      languageTwoLevel,
      languageThreeValue,
      languageThreeLevel,
    } = params;
    const availability: AvailabilityFormI = {
      availabilityStatus: parseParamsToArray(availabilityStatus, true) as number[],
      availabilityDate,
    };
    const expectedSalary: ExpectedSalaryFormI = {
      currency: +expectedSalaryCurrency || null,
      salary: expectedSalaryMin || expectedSalaryMax ? {min: expectedSalaryMin, max: expectedSalaryMax} : null,
    };
    const skills = new CheckboxGroupedValue([], parseParamsToArray(professionalSkills, true) as number[]);
    const languages: LanguageLevelFormI = {
      languageOneValue: +languageOneValue || null,
      languageOneLevel: +languageOneLevel || null,
      languageTwoValue: +languageTwoValue || null,
      languageTwoLevel: +languageTwoLevel || null,
      languageThreeValue: +languageThreeValue || null,
      languageThreeLevel: +languageThreeLevel || null,
    };
    return new CrewSearchFilterForm(
      +offer || null,
      parseParamsToArray(positionGroup, true) as number[],
      parseParamsToArray(position, true) as number[],
      +lookingJobStatus || null,
      availability,
      parseParamsToArray(contractType, true) as number[],
      expectedSalary,
      skills,
      languages,
      yachtExperienceMin || yachtExperienceMax ? {min: yachtExperienceMin, max: yachtExperienceMax} : null,
      notSmocking ? conditionalStatusToBoolean(+notSmocking) : null,
      notVisibleTattoos ? conditionalStatusToBoolean(+notVisibleTattoos) : null,
    );
  }

  public static mapParamsToAdditionalFilterForm(params: Params): CrewSearchAdditionalFilterForm {
    const {
      myLocationLat,
      myLocationLng,
      distance,
      nearMe,
      nearBoat,
      sort,
    } = params;
    const position = myLocationLat && myLocationLng ? new LocationLatLngDto(myLocationLat, myLocationLng) : null;
    const nearMeValue = conditionalStatusToBoolean(+nearMe);
    const nearBoatValue = nearMeValue ? null : conditionalStatusToBoolean(+nearBoat);
    const location = new SearchLocationForm(position, distance ? {
      min: 0,
      max: +distance
    } : null, nearMeValue, nearBoatValue);
    return new CrewSearchAdditionalFilterForm(
      location,
      +sort || null,
    );
  }

  public static mapParamsToCrewSearchInputFilterForm(params: Params): CrewSearchInputFilterForm {
    const {email, userId} = params;
    return new CrewSearchInputFilterForm(email, userId);
  }
}
