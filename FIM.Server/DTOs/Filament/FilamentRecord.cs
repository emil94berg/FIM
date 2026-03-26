using FIM.Server.Models;
using System.Runtime.CompilerServices;

namespace FIM.Server.DTOs.Filament
{
    public record FilamentRecord(
            string identifier,
            string brand,
            string name,
            string material,
            double weight,
            double diameter,
            string? colorHex,
            List<string>? colorHexes,
            int? extruderTemp,
            int? bedTemp,
            string? finish,
            bool translucent,
            bool glow
        
    )
    {
        public static FilamentRecord ToFilamentRecord(PublicFilamentCatalog catalog)
        {
            return new FilamentRecord(
                    catalog.Identifier,
                    catalog.Brand,
                    catalog.Name,
                    catalog.Material,
                    catalog.Weight,
                    catalog.Diameter,
                    catalog.ColorHex,
                    catalog.ColorHexes,
                    catalog.ExtruderTemp,
                    catalog.BedTemp,
                    catalog.Finish,
                    catalog.Translucent,
                    catalog.Glow
                );

        }
        public static List<FilamentRecord> ToFilamentRecordList(List<PublicFilamentCatalog> catalog)
        {
            List<FilamentRecord> returnList = new List<FilamentRecord>();
            foreach (var c in catalog)
            {
                var filamentRecord = ToFilamentRecord(c);
                returnList.Add(filamentRecord);
            }
            return returnList;
        }



        public record FilamentRecordDto(
            string identifier,
            string brand,
            string name,
            string material,
            double weight,
            double diameter,
            string? colorHex,
            List<string>? colorHexes,
            int? extruderTemp,
            int? bedTemp,
            string? finish,
            bool translucent,
            bool glow,
            bool isFavorite
            );

        //public static FilamentRecordDto ToFilamentRecordDto(FilamentRecord filament)
        //{
        //    return new FilamentRecordDto(
        //        filament.identifier,
        //        filament.brand,
        //        filament.name,
        //        filament.material,
        //        filament.weight,
        //        filament.diameter,
        //        filament.colorHex,
        //        filament.colorHexes,
        //        filament.extruderTemp,
        //        filament.bedTemp,
        //        filament.finish,
        //        filament.translucent,
        //        filament.glow,
        //        false


        //        );

        //}


    }
}
