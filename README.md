# Hospital Occupancy Visualizer

Web application to visualize weekly average US hospital occupancy on a facility-level basis.

Data is sourced from [COVID-19 Reported Patient Impact and Hospital Capacity by Facility](https://healthdata.gov/Hospital/COVID-19-Reported-Patient-Impact-and-Hospital-Capa/anag-cw7u) published by the US Department of Health and Human Services (HHS).

## Methodology

Under ideal circumstances, the metrics calculated is a form of "percent occupied"/"percent available". The term "available" is defined to mean a inpatient or ICU bed that is not only vacant, but also staffed. Four metrics are calculated:
- How full is the hospital with adult patients?
- How full is the hospital with adult confirmed and suspected COVID patients?
- How full is the adult ICU?
- How full is the adult ICU with confirmed and suspected COVID patients?

### Inherent Weaknesses

Not all metrics are calculated under ideal circumstances. This dataset possesses 2 inherent obstacles:
1. This data is reported manually by each individual hospital
2. This data is includes redacted or null information due to patient privacy concerns

Manual reporting of data comes with its own issues. Only obvious errors are corrected, meaning many errors go unnoticed. Data may be entered incorrectly or in the wrong fields. Furthermore, there exists semantic problems that can make comparing data and calculating reasonable metrics difficult. Two significant issues are highlighted:

1. Distinction between "confirmed" and "confirmed and suspected" COVID-19 cases
2. Distinction between "available bed" and "bed"

Between facilities, hospital personnel may interpret these terms differently. 

Due to the high occurance of redacted and null information in pediatric data, most children's hospitals have been eliminated from the displayed data set.

This data is not guaranteed to be perfect; as such the metrics derived from the raw data may not be accurate. It is important to note that several large groups of facilities are not represented in this data, including US Department of Veterans Affairs (VA), Defense Health Agency (DHA), Indian Health Service (IHS), psychiatric, and rehabilitation hospitals. Regardless, this data "has been reliable enough to be used in Federal response planning". For more information, please visit the [Careset Github]("https://github.com/CareSet/COVID_Hospital_PUF").

### Missing, Redacted, and Wrong Entries

In the case of redacted or null data points, it is possible to derive these data points from data points from tangential data fields. For example, if an average is redacted, it can be calculated by dividing the equivalent sum and coverage data fields. If the equivalent sum data field is redacted, a value of 4 is assumed as the Department of Health and Human Services redacts values below 4 due to privacy concerns. **These direct derivations and assumptions are not noted in the web application.**

When processing the data, metrics calculated from missing or obviously wrong data points are estimated using similar data fields (e.g. staffed adult beds vs. all adult inpatient beds). **Estimations are noted in the web application with an asterisk (*).** 

Metrics are restricted through a soft/hard limit system. **Capacity metrics exceeding 150% are assumed to be incorrect, and estimations are attempted using similar data fields**. If estimation attempts fail, the limit is adjusted to 200% and the process is repeated. **Capacity metrics exceeding 200% are capped**. This is done to maintain fidelity while limit skewing of aggregated data in the web application. **Limits are noted in the web application with an dagger (†)**

### Additional Information

For implementation details, please read the Jupyter Notebook Files
- [Geocoder](https://github.com/sanders-li/hovis/blob/master/hospital_data_geocoder.ipynb) gets the latitude/longitude coordinates of each facility, as well as correcting missing or incorrect address errors.
- [Metric Calculator](https://github.com/sanders-li/hovis/blob/master/hospital_dataset_metric_calculation.ipynb) calculates four metrics stated above.

## Tech Stack

Data Science:
- Python (Pandas, Numpy, Matplotlib)
- Jupyter Notebooks

Web Technologies:
- React (Redux, deck.gl, react-vis, Material-UI)

## Attributions
Thanks to Jeff Delaney at [fireship.io](https://fireship.io/) for his US Gun Violence App that inspired this project and [AdriSolid](https://github.com/AdriSolid) for his React/Redux timeslider implementation.
